# AdeeptRaspTankGUI
## A simple and easy to change Web GUI for the Adeept RaspTank.

Just a starter for those who are learning to code Python and Web interfaces, but don’t want to also learn the vue.js Javascript Framework. It helps to easily add new functions to the GUI that control new code in the robot.
## Do the following to get it going:
### Copy files:
indexcust.html -> \<your adeept_rasptank path\>/server/dist/

js/code.js -> \<your adeept_rasptank path\>/server/dist/js/

css/styles.css -> \<your adeept_rasptank path\>/server/dist/css/

### Edit code:
Open python code file (you need to use appropiate credentials to save the file): \<your adeept_rasptank path\>/server/app.py

Search for 
```
“@app.route('/')”
```
Add the following after the return:
```
@app.route('/cust')
def custom():
    return send_from_directory(dir_path+'/dist', 'indexcust.html')
```
After that it should look like:
```
@app.route('/')
def index():
    return send_from_directory(dir_path+'/dist', 'index.html')

@app.route('/cust')
def custom():
    return send_from_directory(dir_path+'/dist', 'indexcust.html')
```

Save and close the file.

Restart the webserver.py

###Open the custom GUI in a Webbrowser:
<ip>:5000/cust
The original GUI is still available under:
<ip>:5000


## To make Hand and Arm up and down buttons work, add the following in file:
\<your adeept_rasptank path\>/server/webserver.py
in function:
robotCtrl

add before the line:
```
elif 'home'
```

```
elif 'armup' == command_input:
    H1_sc.singleServo(12, 1, 7)

elif 'armdown' == command_input:
    H1_sc.singleServo(12, -1, 7)

elif 'ARstop' in command_input:
    H1_sc.stopWiggle()

elif 'forearmup' == command_input:
    H2_sc.singleServo(13, -1, 7)

elif 'forearmdown' == command_input:
    H2_sc.singleServo(13, 1, 7)

elif 'FAstop' in command_input:
    H2_sc.stopWiggle()
```
