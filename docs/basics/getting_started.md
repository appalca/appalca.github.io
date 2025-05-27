# Getting started

:::{warning}
At the moment, EcoInvent is required to run Appa Build, even if you don't use it in your project. This will be fixed in February.
:::

## Installation
Appa Build and Appa Run are available on PyPI.
Appa Build requires at least Python 3.10, while Appa Run requires at least Python 3.9.
Tested and recommended version is Python 3.11.
Since Appa Run is required by Appa Build, you can install both by using:
```
pip install appabuild
```

If you only need Appa Run, you can use:
```
pip install apparun
```

We recommend using virtualenv to limit the risks of package dependency conflicts, that are likely to occur with Appa Build, as Brightway requires a specific version of *numpy* to run.

### Installation with source code

You may need to install Appa Build and/or Appa Run from source if you intend to modify the source or change some package versions in requirements.txt.

### Appa Run

Clone the repository first:

```
git clone https://github.com/appalca/apparun
cd apparun
```

It is recommended to use a virtualenv before installing Appa Run package dependencies. You can then use:

```
pip install -r requirements.txt
```

If you want to use Appa Run to run Appa Build, or to use its CLI, you need to build the package:
If necessary, you can install wheel using `pip install wheel`.

```
python setup.py sdist bdist_wheel
```

### Appa Build

Clone the repository first:

```
git clone https://github.com/appalca/apparun
cd appabuild
```

To install the dependencies of Appa Build (using the desired Python installation), you will need to specify the path of the packaged Appa Run: 

```
pip install ../apparun/dist/apparun-X.X.X-py3-none-any.whl -r requirements.txt
```

Replacing `X.X.X` with the appropriate version. 

If you want to use the Appa Build CLI, you need to build the package:
If necessary, you can install wheel using `pip install wheel`.

```
python setup.py sdist bdist_wheel
``` 

## Usage
Appa Build and Appa Run most basic interface are their command line interfaces (CLIs).
The following CLI commands will allow you to verify that both packages are properly installed by respectively building and running a sample impact model.

### Appa Build
To test your Appa Build installation, you can set the project directory with the ```BRIGHTWAY2_DIR``` environment variable.
```
export BRIGHTWAY2_DIR=brightway2_project/
```

You will also need an EcoInvent database. The tested version is 3.9.1 cutoff.
You must indicate the path of the folder containing the .spold datasets in `samples/conf/appalca_conf.yaml`.

More information can be found in section [Appa Build Basics](appa_build_basics.md).

Documentation about the CLI can be obtained by running the following command:
```
appabuild --help
```

Here is an example of the Appa Build CLI call to build the demo impact model:
```
appabuild lca build samples/conf/appalca_conf.yaml samples/conf/nvidia_ai_gpu_chip_lca_conf.yaml
```

Both arguments are covered in section [Appa Build basics](appa_build_basics.md).

### Appa Run
You will need an environment variable to specify where the impact models are located.
```
export APPARUN_IMPACT_MODELS_DIR=samples/impact_models/
```

Documentation about the CLI can be obtained by running the following command:
```
apparun --help
```

Here is an example of Appa Run CLI call to use the demo impact model:
```
apparun compute nvidia_ai_gpu_chip samples/conf/parameters.yaml --output-file-path outputs/scores.yaml
```
