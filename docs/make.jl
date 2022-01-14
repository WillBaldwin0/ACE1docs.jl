using ACEdocs
using Documenter

DocMeta.setdocmeta!(ACEdocs, :DocTestSetup, :(using ACEdocs); recursive=true)

makedocs(;
    modules=[ACEdocs],
    authors="Christoph Ortner <christophortner0@gmail.com> and contributors",
    repo="https://github.com/cortner/ACEdocs.jl/blob/{commit}{path}#{line}",
    sitename="ACEdocs.jl",
    format=Documenter.HTML(;
        prettyurls=get(ENV, "CI", "false") == "true",
        canonical="https://cortner.github.io/ACEdocs.jl",
        assets=String[],
    ),
    pages=[
        "Home" => "index.md",
    ],
)

deploydocs(;
    repo="github.com/cortner/ACEdocs.jl",
    devbranch="main",
)
