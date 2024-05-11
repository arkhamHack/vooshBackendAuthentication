# Voosh Backend Authentication
Api authentication system for voosh

Steps to follow: 
1. Git clone the repo
2. Save the env file sent in the mail in the root folder, just outside src. Kindly set port to 3000.
3. If you want to dockerize, run :
     1. sudo docker build -t my-app .
     2. docker run -p 3000:3000 my-app
     
4. Else run:
      1. yarn build
      2. yarn start
5. Points to note:
    Due to time constraints, there are some issues like google and github oauth need to be accessed from the terminal as swagger shows failed but it actually doesnt fail. The response for both of these will be a new page with the tokena and userId. I am aware that is a security issue, but it is good for demonstrations.

6. Setup Swagger interface on Local
<img width="1510" alt="image" src="https://github.com/arkhamHack/vooshBackendAuthentication/assets/72064090/bb62adcf-e13b-4920-ae88-29544ff9b514">

