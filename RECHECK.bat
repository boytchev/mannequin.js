@echo off
rem next if is used to not close the window in case of error
if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )

call npx eslint src\*.js
call npx eslint src\shapes\*.js
call npx eslint src\organs\*.js
call npx eslint src\bodies\*.js
call npx eslint src\editor\*.js

call npx eslint docs\*.html
call npx eslint --fix src\editor\*.html

pause
exit