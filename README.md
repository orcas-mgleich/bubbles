# bubbles
Playing with bubbles - BitKoeppe example project to learn web development

## Session 1
- Show how HTML, CSS and JavaScript works.
- Bubbles with different colors will be automatically created and moving to top.

## Session 2
- Target line and a legend inserted.
- Speed will be automatically incremented.
- Bubbles can be shot.
- Code restructured.
- All in English.

## Session 3
- JavaScript and CSS parts separated in own files.
- Result message on end of game is now styled.
- Code explained again.

## Session 4
- Highscore will be saved to database.
  - Install (under Windows you can use XAMPP)
    - Apache Webserver
    - MariaDB Database
    - PHP
  - Prepare database.
    - Create database `bubbles`
    - Create database table `highscore` (@see /database/create.sql)
  - Configure Apache Webserver VHost.
    - hostname `bubbles` in `/etc/hosts` (Linux) or `C:\Windows\System32\drivers\etc\hosts`
    - vhost to redirect request to `http://bubbles` to project dir
- New bubbles.php to handle reading and writing from/to database.
- New Points counter.