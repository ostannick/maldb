## About malDB

malDB is an open-source peptide mass fingerprinting web application that allows the user to create their own peptide database tables to search against. Since malDB is built as a web application, you can install it as either:

- A web server running locally on your computer (access via 127.0.0.1:8000)
- A web server running on a networked machine. malDB includes (access via <LAN_IP>:8000)

malDB provides the following features:

- Uploading, digesting and storage of any proteome(s) in .fasta format
- Definition of custom mass modifications
- Searching through database tables using experimental mass lists to determine protein identity
- Multi-layer perceptron for predicting a protein's fingerprint based on primary sequence alone
- Additional useful mass spectrometry tools

## Installing malDB on Windows / Linux

Installing malDB involves deploying a Laravel application on a machine that can serve as a webserver:

1. [Download PHP](https://www.php.net/downloads.php) and add the root folder to your PATH.
2. [Download Composer](https://getcomposer.org/).
3. [Download MySQL](https://dev.mysql.com/downloads/installer/) and install MySQL server and MySQL workbench.
4. In the PHP folder, open php.ini and change the line `;extension=pdo_mysql` to `extension=pdo_mysql` (remove the semicolon).
5. Add a schema to your MySQL database called 'maldb'.
6. Clone this repository.
7. Open the .env file in the repository root, and set the appropriate environment variables to connect to the MySQL database.
8. In a terminal, migrate to the root of the repository folder.
9. Run `php artisan key:generate`
10. Run `php artisan migrate`
11. Run `php artisan serve`

You should now be able to access malDB in a web browser via http://127.0.0.1:8000/
