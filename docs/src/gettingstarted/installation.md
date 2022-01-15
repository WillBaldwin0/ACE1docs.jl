
# Installation Instructions

## Short Version

From the Julia REPL: 
```julia
using Pkg; pkg"registry add https://github.com/JuliaMolSim/MolSim.git"; pkg"add JuLIP ACE PyCall ASE IPFitting"
```

## Detailed Instructions

If you have any difficulties with the following setup process, please file an issue. We highly recommend familiarizing oneself with the [Julia package manager](https://github.com/JuliaLang/Pkg.jl) and how Project management is best done in Julia. In particular all project should manage their own `Project.toml` file with appropriate version bounds, and where appropriate the `Manifest.toml` file can be tracked in order to guarantee reproducability of results. 

1. Install [Julia](https://julialang.org). We recommend v1.6 or upwards. 
2. Install the [`MolSim` registry](https://github.com/JuliaMolSim/MolSim): start the Julia REPL, switch to package manager by typing `]` and then run
```julia
registry add https://github.com/JuliaMolSim/MolSim.git
```
3. Create a folder for your new project that will use `ACE1.jl`. Change to that folder, start the Julia REPL and activate a new project, by switching to the package manager `]`, and then 
```julia 
activate .
```
Now you can install the relevant packages that you need, e.g., 
```julia
add JuLIP ACE1
```
Next you should probably edit `Project.toml` and insert a version bound for `ACE1` - see the Julia [package manager documentation](https://pkgdocs.julialang.org/dev/) for more information.

4. To use [ase](https://wiki.fysik.dtu.dk/ase/) from Julia, you can use [PyCall](https://github.com/JuliaPy/PyCall.jl) or the [ASE.jl](https://github.com/JuliaMolSim/ASE.jl) interface. To install these, run
```julia
add PyCall ASE
```
from the package manager to add those to your project.

5. For fitting, you may wish to use [`IPFitting.jl`](https://github.com/cortner/IPFitting.jl),
```julia
add IPFitting
```
This has `ASE.jl` as a dependency.

## Trouble-shooting

* On some systems `ASE.jl` is unable to automatically install python dependencies. We found that installing [Anaconda](https://anaconda.org) and then pointing `PyCall.jl` to the Anaconda installation (cf [PyCall Readme](https://github.com/JuliaPy/PyCall.jl)) resolves this. After installing Anaconda, it should then be sufficient to build `ASE.jl` again.
* If you cannot use Anaconda python, or if the last point failed, then you can try to install the python dependencies manually before trying to build `ASE.jl` again. Specifically, it should be sufficient to just install the [ase](https://wiki.fysik.dtu.dk/ase/) package. Please follow the installation instructions on their website.
