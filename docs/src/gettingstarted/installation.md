
# Installation Instructions

## Quickstart

This package can be installed by first adding the ACE registry from the Julia package manager and pulling the ACE and JuLIP packages

`] registry add https://github.com/JuliaMolSim/MolSim.git`
`] add JuLIP, ACE`

Next `/examples/tut1.jl` provides an overview of how to set up the ACE basis and how to do perform a simple fit.


### Installation (v0.8.x) --- Short Version

```julia
using Pkg; pkg"registry add https://github.com/JuliaMolSim/MolSim.git"; pkg"add JuLIP ACE PyCall ASE IPFitting"
```

### Installation (v0.8.x)

If you have any difficulties with this setup process, please file an issue.

1. Install [Julia](https://julialang.org). We recommend v1.6 or upwards, but v1.3 upwards should in principle work as well.
2. Install the [`MolSim` registry](https://github.com/JuliaMolSim/MolSim); from the Julia REPL, switch to package manager `]` and then run
```julia
registry add https://github.com/JuliaMolSim/MolSim.git
```
3. Install some important registered packages; from Julia REPL / package manager:
```julia
add JuLIP ACE         # maybe add other packages from MolSim registry
```
This will install the *stable* `v0.8.x` version of ACE, as the (equivariant) development version has not been registered yet.
4. To use [ase](https://wiki.fysik.dtu.dk/ase/) from Julia, you can use [PyCall](https://github.com/JuliaPy/PyCall.jl) or the [ASE.jl](https://github.com/JuliaMolSim/ASE.jl) interface. To install these, run
```julia
add PyCall ASE
```
from the package manager.
5. For fitting, you may wish to use [`IPFitting.jl`](https://github.com/cortner/IPFitting.jl),
```julia
add IPFitting
```
This has `ASE.jl` as a dependency. (Keep fingers crossed and hope it will be compatible with the current version of `ACE.jl`...)
