
# IPFitting.jl

IPFitting.jl is used to fit ACE1 potentials by using the ACE1 basis to create and solver a linear system given a training database of atomistic configurations.

Reading in a `.xyz` database is done as follows and requires the energy/force/virial keys to be set. 

```julia
al = IPFitting.Data.read_xyz(@__DIR__() * "/TiAl_tutorial_DB.xyz", energy_key="energy", force_key="force", virial_key="virial")
```

Using an ACE basis `B` a linear system can then be created

`dB = LsqDB("", B, al)`

Before solving generally a reference potential is defined containing the isolated atom energies

`Vref = OneBody(:Ti => -1586.0195, :Al => -105.5954)`

as well as the energy/force/virial weights.

`weights = Dict(
        "default" => Dict("E" => 5.0, "F" => 1.0 , "V" => 1.0 ))`

Solving the linear system can be done through the use of several solvers:

`solver = Dict(
        "solver" => :lsqr,
        "damp" => 5e-3,
        "atol" => 1e-6)`

`solver = Dict(
        "solver" => :rrqr,
        "rrqr_tol" => 1e-5)`

`solver = Dict(
        "solver" => :brr)`

`solver= Dict(
         "solver" => :ard,
         "ard_tol" => 1e-4,
         "threshold_lambda" => 1e-2)`

Performing the fit, `asmerrs=true` calculates the training errors which are also stored in the `lsqinfo`

`IP, lsqinfo = lsqfit(dB, weights=weights, Vref=Vref, asmerrs = true)`.

Exporting to `.yace` format for LAMMPs support. More details on how to run the `.yace` potential in ...

`ACE1.ExportMulti.export_ACE("./filename.yace", IP)`
