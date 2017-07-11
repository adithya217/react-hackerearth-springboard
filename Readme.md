
This is a frontend project code challenge that I did for springboard on HackerEarth.
I finished about ~90% of the required features.

This project helped me learn ReactJS.

This app has been written using NodeJS v4.5.0 x64 on Windows 10. Express plugin for NodeJS has been used for convenience.

* Additional client-side frameworks:
** ReactJS v15.3.1
** Babel v5.8.38
** Font Awesome v4.6.3

Since this has not been hosted on a cloud portal, I have include the assets in this project itself.

To run this project, the command is:
node app.js

Before that, install express as follows:
npm install express

or use `npm install` to install all required packages for this project.

The features completed here are:
1.) Basic responsive css
2.) List of items from the API
3.) Sort functionality with vote up/down, learners, duration
4.) Upvote/downvote, total upvotes - using local storage
5.) View curriculum opens the provided url in that item in a new tab

As the API provided in the question details seems to rate-limited and already near the threshold, I have hardcoded the json from a specific request and am serving it in the backend that I wrote. However, the code to get data directly from the mentioned endpoint is also present and if needed, it can be uncommented.

Pending:
1.) Search with tags, autocomplete
2.) Bottom course selection bar.

Will complete them and re-upload if finished within given time.

NOTE: Seach tags functionality is partially complete.







