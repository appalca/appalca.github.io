# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

# import os
# import sys

# sys.path.insert(0, os.path.abspath("../appabuild/"))
# sys.path.insert(0, os.path.abspath("../apparun/"))

project = "Appa LCA"
copyright = "2025, CEA"
author = "Maxime Péralta"
release = "1.0.0"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

needs_sphinx = "8.2.0"

extensions = [
    "autoapi",
    "myst_parser",
    "sphinx_design",
    "sphinx_copybutton",
]

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "pydata_sphinx_theme"
html_theme_options = {
    "show_nav_level": 2,
    "icon_links": [
        {
            "name": "Github",
            "url": "https://github.com/appalca/appalca.github.io",
            "icon": "fa-brands fa-square-github",
            "type": "fontawesome",
        }
    ],
    "logo": {
        "text": "Appa LCA framework",
        "image_light": "_static/cea.png",
        "image_dark": "_static/cea.png",
    },
}
html_static_path = ["_static"]
html_css_files = ["style.css", "code_annotations.css"]
html_js_files = ["code_annotations.js"]

myst_number_code_blocks = ["yaml"]

# Disable the "Show source" link
html_show_sourcelink = False

#################################################
## Autoapi configuration                       ##
#################################################

# Where Autoapi will search files to generate the documentation
autoapi_dirs = ["../appabuild", "../apparun"]

# The patterns of files/folders that will be ignored
autoapi_ignore = [
    "*tests/*",
    "*tests.py",
    "*.yml",
    "*.md",
    "*.json",
]

# Options for display of the generated documentation
autoapi_options = [
    "members",  # Display the children of an object
    "show-inheritance",  # Display a list of base classes below the class signature
    "undoc-members",  # Display objects that have no docstring
    "show-module-summary",  # Whether to include autosummary directives in generated module documentation.
]

# Which docstring to insert into the content of a class (use the concatenation of the class docstring and the __init__ docstring)
autoapi_python_class_content = "both"
# The order to document members: order members by their type then alphabetically
autoapi_member_order = "groupwise"
# Name of the folder where the generated files will be put (deleted after build of the documentation is finished)
autoapi_root = "api"

# Primary page config
html_sidebars = {"home/home": []}  # Remove the primary side bar from the home page
