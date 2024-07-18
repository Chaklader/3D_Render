

SETUP
–––––

Install pyenv
–––––––––––––
$ brew update
$ brew install pyenv

We can also use cURL for installation:

$ curl https://pyenv.run | bash

$ pyenv install 3.9.18
$ pyenv local 3.9.18 (can also set globalas, pyenv global 3.9.18)


Then, run these exports commands in the terminal:

$ export PYENV_ROOT="$HOME/.pyenv"
$ export PATH="$PYENV_ROOT/bin:$PATH"
$ eval "$(pyenv init -)"

Check version:

$ python3 --version
Python 3.9.18

Setup the environment:

$ python3 -m venv .venv
$ source .venv/bin/activate
$ python3 --version
Python 3.9.18

Install deps and run
––––––––––––––––––––

$ pip3 install -r requirements.txt
$ python3 app.py 



OPEN IN BROWSER
–––––––––––––––

`http://127.0.0.1:5015/CubeSpace/public/api/scans/viewer/9766`
`http://127.0.0.1:5015/CubeSpace/public/api/scans/viewer/10606`
