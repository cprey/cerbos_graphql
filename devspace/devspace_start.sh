#!/bin/bash
set +e  # Continue on errors

export NODE_ENV=development
if [ -f "yarn.lock" ]; then
   echo "Installing Yarn Dependencies"
   yarn
else 
   if [ -f "package.json" ]; then
      echo "Installing NPM Dependencies"
      npm install
   fi
fi

COLOR_BLUE="\033[0;94m"
COLOR_GREEN="\033[0;92m"
COLOR_RESET="\033[0m"

# Print useful output for user
echo -e "${COLOR_BLUE}
     %########%      
     %###########%       ____                 _____                      
         %#########%    |  _ \   ___ __   __ / ___/  ____    ____   ____ ___ 
         %#########%    | | | | / _ \\\\\ \ / / \___ \ |  _ \  / _  | / __// _ \\
     %#############%    | |_| |(  __/ \ V /  ____) )| |_) )( (_| |( (__(  __/
     %#############%    |____/  \___|  \_/   \____/ |  __/  \__,_| \___\\\\\___|
 %###############%                                  |_|
 %###########%${COLOR_RESET}


Welcome to your development container!

This is how you can work with it:
- Files will be synchronized between your local machine and this container
- Some ports will be forwarded, so you can access this container via localhost
- Run \`${COLOR_GREEN}npm start${COLOR_RESET}\` to start the application
"

# Set terminal prompt
export PS1="\[${COLOR_BLUE}\]devspace\[${COLOR_RESET}\] ./\W \[${COLOR_BLUE}\]\\$\[${COLOR_RESET}\] "
if [ -z "$BASH" ]; then export PS1="$ "; fi

# Include project's bin/ folder in PATH
export PATH="./bin:$PATH"

# Open shell
#bash --norc
npm install
npm start index.ts