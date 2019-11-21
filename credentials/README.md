# Credentials Folder

## The purpose of this folder is to store all credentials needed to log into your server and databases. This is important for many reasons. But the two most important reasons is
    1. Grading , servers and databases will be logged into to check code and functionality of application. Not changes will be unless directed and coordinated with the team.
    2. Help. If a class TA or class CTO needs to help a team with an issue, this folder will help facilitate this giving the TA or CTO all needed info AND instructions for logging into your team's server. 


# Blow is a list of items required. Missing items will causes points to be deducted from multiple milestone submissions.

1. Server IP: 18.216.41.97
2. SSH username: ubuntu
3. SSH key: admin.pem
4. Database IP: csc648-team03.cnzsqesnuc2l.us-east-2.rds.amazonaws.com, Database Port: 3306
5. Database username: admin
6. Database password: RLa2OAk0bCqzlweqFUH1
7. Database name: csc648-team03
8. Instructions on how to use the above information:<br>
	a) To connect to server: Open terminal or command prompt, navigate to folder containing SSH key file, paste the following command "ssh -i "admin.pem" ubuntu@ec2-18-216-41-97.us-east-2.compute.amazonaws.com", and press enter.<br>
	b) To connect to database: First, download and install a MySQL client (Workbench, DataGrip). Then, enter the database information provided above to connect.<br>

# Most important things to Remember
## These values need to kept update to date throughout the semester. <br>
## <strong>Failure to do so will result it points be deducted from milestone submissions.</strong><br>
## You may store the most of the above in this README.md file. DO NOT Store the SSH key or any keys in this README.md file.
