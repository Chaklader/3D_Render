

# SETUP

- Install LFS `git lfs install` 
- Clone the repo and run `git lfs pull` to receive the Splat file 

<br>

### Install Pyenv

<br>

```
$ brew update
$ brew install pyenv
```

<br>

We can also use cURL for installation:

```
$ curl https://pyenv.run | bash

$ pyenv install 3.9.18
$ pyenv local 3.9.18 (can also set globalas, pyenv global 3.9.18)
```

<br>

Then, run these exports commands in the terminal:

```
$ export PYENV_ROOT="$HOME/.pyenv"
$ export PATH="$PYENV_ROOT/bin:$PATH"
$ eval "$(pyenv init -)"
```

<br>

Check version:

```
$ python3 --version
Python 3.9.18
```

<br>

### Virtual Environment Setup 

```
$ python3 -m venv .venv
$ source .venv/bin/activate
$ python3 --version
Python 3.9.18
```

<br>

## Install Deps and Run

```
$ pip3 install -r requirements.txt
$ python3 app.py 
```

<br>

### Open in Browser 

<br>

http://127.0.0.1:5015/CubeSpace/public/api/scans/viewer/1000
