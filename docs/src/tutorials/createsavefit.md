# creating and saving a fit

using ACE1
using IPFitting

### READING IN XYZ
al = IPFitting.Data.read_xyz(@__DIR__() * "/TiAl_tutorial_DB.xyz", energy_key="energy", force_key="force", virial_key="virial")[1:10:end];

### TAKE AVERAGE TYPICAL DISTANCE
### WE CAN DO THIS PAIR SPECIFIC, MAYBE OTHER NOTEBOOK?
r0 = 0.5*(rnn(:Ti) + rnn(:Al))

### SETTING UP ACE BASIS
ACE_B = ACE1.Utils.rpi_basis(species = [:Ti, :Al],
                              N = 3,
                              r0 = r0,
                              rin = 0.6 * r0,
                              rcut = 5.5,
                              maxdeg = 6)

### PAIR POTENTIAL
Bpair = pair_basis(species = [:Ti, :Al],
      r0 = r0,
      maxdeg = 6,
      rcut = 7.0,
      pcut = 1,
      pin = 0)   # pin = 0 means no inner cutoff

### COMBINED BASIS PAIR + ACE
B = JuLIP.MLIPs.IPSuperBasis([Bpair, ACE_B]);

### CREATE LEAST SQUARES SYSTEM, "" DOES NOT SAVE
dB = LsqDB("", B, al)

### REFERENCE POTENTIAL CONTAINING THE E0S
Vref = OneBody(:Ti => -1586.0195, :Al => -105.5954)

### WEIGHTS PER CONFIG TYPE
weights = Dict(
        "FLD_TiAl" => Dict("E" => 5.0, "F" => 1.0 , "V" => 1.0 ),
        "TiAl_T5000" => Dict("E" => 30.0, "F" => 1.0 , "V" => 1.0 ))

### LAPLACIAN PRECONDITIONING, IF NOT DEFINED P DEFAULTS TO DIAGONAL MATRIX (NO PRECON)
using LinearAlgebra
rlap_scal = 3.0
P = Diagonal(vcat(ACE1.scaling.(dB.basis.BB, rlap_scal)...))

### PERFORM FIT
IP, lsqinfo = lsqfit(dB, weights=weights, Vref=Vref, asmerrs = true);

## ERROR TABLE
#rmse_table(lsqinfo["errors"])

## SAVE POTENTIAL
save_dict("./TiAl_tutorial_pot.json", Dict("IP" => write_dict(IP), "info" => lsqinfo))

ACE1.ExportMulti.export_ACE("./TiAl_tutorial_pot.yace", IP)
