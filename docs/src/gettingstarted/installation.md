
# Installation Instructions

## One-line Version

From the Julia REPL: 
```julia
using Pkg; pkg"registry add https://github.com/JuliaRegistries/General"; pkg"registry add https://github.com/JuliaMolSim/MolSim.git"; pkg"add JuLIP ACE1 PyCall ASE IPFitting@0.4"
```

## Detailed Instructions

If you have any difficulties with the following setup process, please file an issue. We highly recommend familiarizing oneself with the [Julia package manager](https://github.com/JuliaLang/Pkg.jl) and how Project management is best done in Julia. In particular all projects should manage their own `Project.toml` file with appropriate version bounds, and where appropriate the `Manifest.toml` file can be tracked in order to guarantee reproducibility of results. 

### Installing Julia

Download and unpack [Julia](https://julialang.org). We recommend v1.6 or upwards. Add the `julia` executable to your path with something like `export PATH=<julia-directory>/bin:$PATH`.

Start the Julia REPL (type `julia` followed by Enter), switch to package manager by typing `]`, then install the General registry and the [`MolSim` registry](https://github.com/JuliaMolSim/MolSim):
```julia
registry add https://github.com/JuliaRegistries/General
registry add https://github.com/JuliaMolSim/MolSim.git
```
Press Backspace or `Ctrl-c` to exit the package manager. Use `Ctrl-d` or `exit()` followed by Enter or Return to close the Julia REPL.

### Setting up a project using ACE1

Create a folder for your new project and change to it. Start the Julia REPL and activate a new project, by switching to the package manager `]`, and then 
```julia 
activate .
```
Now you can install the relevant packages that you need, e.g., 
```julia
add JuLIP ACE1
```
Next you should probably edit `Project.toml` and insert a version bound for `ACE1`. See [this section](/docs/src/gettingstarted/pkg.md) and the Julia [package manager documentation](https://pkgdocs.julialang.org/dev/) for more information.

To use [ase](https://wiki.fysik.dtu.dk/ase/) from Julia, you can use [PyCall](https://github.com/JuliaPy/PyCall.jl) or the [ASE.jl](https://github.com/JuliaMolSim/ASE.jl) interface. To install these, run
```julia
add PyCall ASE
```
from the package manager to add those to your project.

For fitting, you may wish to use [`IPFitting.jl`](https://github.com/ACEsuit/IPFitting.jl),
```julia
add IPFitting@0.4
```
`IPFitting.jl` has `ASE.jl` as a dependency, and IPFitting versions 0.5 and upwards are not compatible with ACE1 at the moment.

## Trouble-shooting

* On some systems `ASE.jl` is unable to automatically install python dependencies. We found that installing [Anaconda](https://anaconda.org) and then pointing `PyCall.jl` to the Anaconda installation (cf [PyCall Readme](https://github.com/JuliaPy/PyCall.jl)) resolves this. After installing Anaconda, it should then be sufficient to build `ASE.jl` again.
* If you cannot use Anaconda python, or if the last point failed, then you can try to install the python dependencies manually before trying to build `ASE.jl` again. Specifically, it should be sufficient to just install the [ase](https://wiki.fysik.dtu.dk/ase/) package. Please follow the installation instructions on their website.
