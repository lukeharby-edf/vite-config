<cfscript>
/*
  Safer CORS filter to:
  - Handle OPTIONS preflight reliably
  - Add CORS headers for allowed origins (echo only when allowed)
  - Serve font files with long cache headers
  - Only include/cfinclude .cfm files if they exist and path-traversal is prevented
  - Conservative, minimal changes to behaviour
*/

/* === Configuration === */
allowedOrigins = [
  "https://slack-wise.tumblr.com"
  // add other allowed origins here
];

allowedMethods = "GET, POST, OPTIONS, HEAD";
allowedHeaders = "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token";
exposeHeaders = "Content-Type, Cache-Control";
allowCredentials = true;
fontExtensions = "ttf,ttc,otf,eot,woff,woff2,map";

/* === Helpers === */
function normalizeHeaderName(name) {
  return replace(arguments.name, "-", "_", "all");
}

function headerLookup(name) {
  // Try several common locations where frameworks store headers
  // 1) request.cfsrc.headers
  if (structKeyExists(request, "cfsrc") && structKeyExists(request.cfsrc, "headers")) {
    // case-insensitive lookup
    for (k in request.cfsrc.headers) {
      if (lcase(k) == lcase(name)) {
        return request.cfsrc.headers[k];
      }
    }
  }
  // 2) request.headers
  if (structKeyExists(request, "headers")) {
    for (k in request.headers) {
      if (lcase(k) == lcase(name)) {
        return request.headers[k];
      }
    }
  }
  // 3) CGI.HTTP_<HEADER>
  hn = "HTTP_" & ucase(replace(name, "-", "_", "all"));
  if (structKeyExists(CGI, hn)) {
    return CGI[hn];
  }
  // Not found
  return "";
}

function requestMethod() {
  if (structKeyExists(request, "cfsrc") && structKeyExists(request.cfsrc, "method")) {
    return ucase(request.cfsrc.method);
  }
  if (structKeyExists(request, "method")) {
    return ucase(request.method);
  }
  if (structKeyExists(CGI, "REQUEST_METHOD")) {
    return ucase(CGI.REQUEST_METHOD);
  }
  return "";
}

function isFontRequest(requestedPath) {
  if (len(trim(requestedPath)) == 0) return false;
  ext = listLast(requestedPath, ".");
  if (len(ext) == 0) return false;
  return findNoCase(ext, fontExtensions) != 0;
}

/* === CORS header emission === */
function emitCorsHeaders(origin) {
  // Only emit if origin is allowed
  for (o in allowedOrigins) {
    if (origin == allowedOrigins[o]) {
      response.headers["Access-Control-Allow-Origin"] = origin;
      response.headers["Access-Control-Allow-Methods"] = allowedMethods;
      response.headers["Access-Control-Allow-Headers"] = allowedHeaders;
      response.headers["Access-Control-Expose-Headers"] = exposeHeaders;
      if (allowCredentials) {
        response.headers["Access-Control-Allow-Credentials"] = "true";
      }
      return true;
    }
  }
  // not allowed: do not emit Access-Control-Allow-Origin
  return false;
}

/* === Main filter entry === */
/* Determine origin and request method */
origin = headerLookup("Origin");
method = requestMethod();

/* If Origin present, attempt to emit CORS headers for allowed origins */
if (len(origin)) {
  emitCorsHeaders(origin);
}

/* Handle preflight (OPTIONS) requests */
if (method == "OPTIONS") {
  // If this is a CORS preflight, respond and exit.
  // Some frameworks populate Access-Control-Request-Method header; check that too.
  acrm = headerLookup("Access-Control-Request-Method");
  if (len(acrm)) {
    response.statusCode = 204; // No Content is typical for preflight
    // Ensure response has some minimal body or no body
    // ColdFusion sometimes needs a write before exit depending on context; write nothing.
    try {
      response.exit();
    } catch (any e) {
      // in case response.exit() isn't available, return early
      return;
    }
  }
}

/* Determine requested path from common places in frameworks */
requested = "";
if (structKeyExists(request, "cfsrc") && structKeyExists(request.cfsrc, "requestedContent")) {
  requested = request.cfsrc.requestedContent;
} else if (structKeyExists(request, "requestedContent")) {
  requested = request.requestedContent;
} else if (structKeyExists(request, "REQUEST_URI")) {
  requested = request.REQUEST_URI;
} else if (structKeyExists(CGI, "SCRIPT_NAME")) {
  requested = CGI.SCRIPT_NAME;
}

/* Normalize requested (strip leading slash) */
requested = reReplace(requested, "^/", "", "all");

/* If request targets a font file, set caching and ensure CORS headers expose Content-Type */
if (isFontRequest(requested)) {
  response.headers["Cache-Control"] = "public, max-age=31536000";
  // If we earlier emitted generic expose headers, ensure Content-Type is exposed for font consumers
  if (!structKeyExists(response.headers, "Access-Control-Expose-Headers")) {
    response.headers["Access-Control-Expose-Headers"] = "Content-Type";
  } else {
    // append if not already present
    if (findNoCase(response.headers["Access-Control-Expose-Headers"], "Content-Type") == 0) {
      response.headers["Access-Control-Expose-Headers"] &= ", Content-Type";
    }
  }
}

/* Proxy/include to a local .cfm only if safe and file exists */
if (len(trim(requested))) {
  // Remove any path-traversal attempts
  safeRequested = reReplace(requested, "(^|/)[.]{2}(/|$)", "", "all");
  // Disallow leading drive letters or absolute paths (platform-agnostic)
  safeRequested = reReplace(safeRequested, "^[\\/]+", "", "all");

  // Build .cfm path relative to current directory
  cfmPath = expandPath("./#safeRequested#.cfm");

  if (fileExists(cfmPath)) {
    // Include the CF page to handle the request
    cfinclude(template=cfmPath);
    try {
      response.exit();
    } catch (any e) {
      return;
    }
  }
  // If file does not exist, we fall through so the web server or framework can try other handlers.
}
</cfscript>