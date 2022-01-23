import os
from ase.calculators.lammpsrun import LAMMPS
from ase.io import read, write
import time

os.environ["ASE_LAMMPSRUN_COMMAND"]="/Users/Cas/gits/lammps-ace/build/lmp"

parameters = {'pair_style': 'pace',
             'pair_coeff': ['* * TiAl_tutorial_pot.yace Ti Al']}

files = ["TiAl_tutorial_pot.yace"]

calc1 = LAMMPS(parameters=parameters, files=files)

at = read("./TiAl_tutorial_DB.xyz", ":")[0]

at.set_calculator(calc1)

print(at.get_potential_energy())
print(at.get_forces())
print(at.get_stress())

N=10

t1 = time.time()
for i in range(N):
	at.rattle(0.1)
	at.set_calculator(calc1)
	at.get_forces()
t2 = time.time()
print("FORCE MS/ATOM PACE")
print(((t2 - t1)/len(at) * 1E3 / N))
