
# Developing a new ACE.jl model

The ACE basis can be set up using the following function `rpi_basis()` containing the species, correlation order `N`, polynomial degree `maxdeg`, nearest neighbour distance `r0` and inner/outer cutoff radii `rin` and `rcut`. Other parameters for defining the size of the basis (provided by `length(B)`) are `wL` and `csp`.
```
B = rpi_basis(species = :Si,
      N = 3,                        # correlation order = body-order - 1
      maxdeg = 13,                  # polynomial degree
      r0 = r0,                      # estimate for NN distance
      D = SparsePSHDegree(; wL=1.3, csp=1.0),
      rin = 0.65*r0, rcut = 5.5,    # domain for radial basis (cf documentation)
      pin = 0)
```
This basis can then be used in combination with `IPFitting.jl` to create a least squares system `dB` used for fitting.
```
al = IPFitting.Data.read_xyz("./Si.xyz", energy_key="dft_energy", force_key="dft_force", virial_key="dft_virial")
dB = LsqDB("", B, al)
```
We can then fit the potential using `lsqfit()` given a set of `weights` and reference one body potential `Vref`.
```
weights = Dict("default" => Dict("E" => 15.0, "F" => 1.0 , "V" => 1.0 ))
Vref = OneBody(Dict("Si" => -158.54496821))
IP, lsqinfo = lsqfit(dB; weights = weights, Vref = Vref, asmerrs = true, solver=(:lap, 1.2));
```
Returning a fitted interatomic potential `IP` and an `lsqinfo` dictionary containing information of the fit, such as the errors which can be displayed in table as follows.
```
rmse_table(lsqinfo["errors"])
```
