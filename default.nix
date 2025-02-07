{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
  pname = "tangotrainer";
  version = "0.0.0";

  src = ./.; # Use the current directory as the source

  buildInputs = [
    pkgs.nodejs_23 # Specify the Node.js version you want
  ];

  shellHook = ''
    export NODE_ENV=development
    export PATH=$PATH:${pkgs.nodejs_23}/bin
  '';

  installPhase = ''
    npm install
  '';

  buildPhase = ''
    npm build
  '';
}
