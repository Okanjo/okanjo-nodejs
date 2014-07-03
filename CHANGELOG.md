
# Okanjo NodeJS SDK Change Log

When stuff changes, it's described here.

# 2014-07-03
 * Cleaned up a straggling error log
 * Bumped version to 0.1.11

# 2014-07-02
 * Added option to use jQuery's $.param function for object serialization instead of the default qs module
 * Bumped version to 0.1.10

# 2014-06-25
 * Added transaction constants
 * Added transaction routes for stores and users
 * Bumped version to 0.1.8

# 2014-05-28
 * Added serialize function to okanjo namespace
 * Added SDK constants to okanjo namespace
 * Added jQuery-based serialization function (aka $.params) with modifications, which can be used for product variants
 * Updated FileUpload helper to use Buffers instead of binary strings and getEntityBody returns a buffer with the binary content
 * Refactored the HTTP provider stream function to handle the entity buffer generation as a callback
 * Suppressed local/global unused definition references (IDEA inspections)

# 2014-05-16
 * Use qs module instead of core querystring module for nested object support
 * Minor bug fixes
 * Added some function docs

# 2014-01-21
 * Added calls to invoke ProductSense

# 2014-01-17
 * Overall implementation done, largely untested
 
# 2014-01-16
 * Initial import / setup