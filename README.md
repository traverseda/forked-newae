## Using this

This git wrapper uses npm & gulp to run the django app and build assets from `/src/`

You must install node: https://nodejs.org/en/download/

Then run `npm install` from the root directory.

From here, you can then run the app and get automatically building assets by running `gulp` from anywhere in the project.

The actual django app is a submodule of this git repo. Ensure you commit the built assets to the repo and push them.
