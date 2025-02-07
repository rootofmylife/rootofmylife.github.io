# Use Strict

The directive looks like a string: `"use strict"` or `'use strict'`. When it is located at the top of a script, the whole script works the “modern” way.

For example:

```javascript
"use strict";

// this code works the modern way
...
```

Please make sure that `"use strict"` is at the top of your scripts, otherwise strict mode may not be enabled.

Strict mode isn’t enabled here:

```javascript
alert("some code");
// "use strict" below is ignored--it must be at the top

("use strict");

// strict mode is not activated
```

Only comments may appear above `"use strict"`.
