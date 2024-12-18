# Getting started

**Warning**: Appa Build and Appa Run will not be available on PyPI until January. To install it, you will need to build from the source code and not using `pip install`.

**Warning**: For the moment, EcoInvent is necessary to run Appa Build, even if you don't use it in your project. This will be fixed in January.

## Installation
Appa Build and Appa Run are available on PyPI.
Appa Build requires at least Python 3.10.X, where Appa Run requires at least Python 3.9.X.
As Appa Run is required by Appa Build, you can install both by using:
```
pip install appabuild
```

If you only need Appa Run, you can use:
```
pip install apparun
```

We recommend using virtualenv to limit the risks of package dependencies conflicts, that are likely to happen with Appa Build, as Brightway requires specific version of numpy to run.

### Installation with source code
If you intend to modify the source code, or change some package versions in requirements.txt, you will need to clone both repositories first:

```
git clone https://github.com/appalca/appabuild
git clone https://github.com/appalca/apparun
```

It is recommended to use a virtualenv before installing the package dependencies, using:
```
pip install -r requirements.txt
```

You then need to build a package for Appa Run as it is a required package for Appa Build:

```
cd apparun
python setup.py sdist bdist_wheel
```

If required, you can install wheel using `pip install wheel`.

Then, you can go to Appa Build to install Appa Run:

```
cd ../appabuild
pip install ../apparun/dist/apparun-0.2.0-py3-none-any.whl -r requirements.txt

```

## Usage
Appa Build and Appa Run most basic interface are their command line interfaces (CLIs).
Next CLI commands will allow to check if both packages are properly installed by to respectively build a sample impact model and run it.

### Appa Build
To test you Appa Build installation, you can set the project's directory with ```BRIGHTWAY2_DIR``` environment variable.
```
export BRIGHTWAY2_DIR=brightway2_project/
```

You also need an EcoInvent database. Tested version is 3.9.1 cutoff.
You must indicate the path of the folder containing the .spold datasets in `samples/conf/appalca_conf.yaml`.

Further information can be found in [Appa Build Basics](appa_build_basics.md) section.

Documentation about the CLI can be obtained by running the following command:
```
appabuild --help
```

Here is an example of Appa Build CLI call to build the demo impact model:
```
appabuild lca build samples/conf/appalca_conf.yaml samples/conf/nvidia_ai_gpu_chip_lca_conf.yaml
```

Both arguments are covered in [Appa Build basics](appa_build_basics.md) section.

### Appa Run
You will need an environment variable to specify where are the impact models located.
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
