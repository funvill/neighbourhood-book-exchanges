# Art of Steven 

This is a general instruction file of Steven best practices


- The computer that Steven uses for code review and devlopment: Windows using powershell



- Version numbers should have a build number that automaticly incurments. 

- Timestamps should be in this format YYYY-MMM-DD-HHMMSS

- All output files, should include the Applications name that generated that file, the version, and the timestamp of when that file was generated. 

- functions should check their parameters at the top of the function
- Fail early in functions. The functions should have many places it fails, but only a few places that pass.

## GUI/ UX

- Always have a "Reset to defaults" button with a "Are you sure?" comformation dialog.
- Any destructive action should have a "Are you sure?" comformation dialog. For example if you are deleting a row in a table. 
- In general, Don't ask customers where to save files. Instead just save the file with a default file name that includes the current timestamp (YYYY-MMM-DD-HHMMSS), to the working directory. Then shell open the folder with the file to reveal the file. 
- Use icons and colors

## Logging

- Always set up a logging system that logs to both the console and the file system automaticly
- If logging to the file system, Log rotation must be built in
- Must support at lest these logging levels (debug, info, error)
- Logs should have a timestamp 
- Logs should have a service/script that the log message orginated from

## CI / Github Actions workflow

- All projects should have a 'test' and a 'build and publish' Github Actions workflow. 
- 'Test' should run on every commit, and automaticly run the unit tests. 
- 'Build and publish' should run when a tag matches 'v*.*.*'. This should produce a Github project release.
  - As close as possiable to a "one button" publish. Make it easy to publish the project so it can happen more frequntly. 
  - Auto update the build number in the version from the CI system. 


## Change log 

- The ```CHANGELOG.MD``` lists a history of changes.
  - Update the changelog with any changes.
  - Add the list of changes to the file in a "## Unreleased" section just below the "# Change Log" title. Do not include a date or version in this list of changes.
  - Add a note that these changes were initated by the AI adgent.

## Unit tests

- Store unit tests in the `/test/` folder

## Code Style

- Use **4 spaces** for indentation.

## NPM

- All package.json should have a 'test', and a 'start' script. 
