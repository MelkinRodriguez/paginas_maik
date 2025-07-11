let esAdministrador=false;
let haIniciadoSesion=true;
if(esAdministrador|| haIniciadoSesion){
    console.log("Acceso concedido.Bienvenido al sistema");
}else{
    console.log("acceso denegado.Debes iniciar sesion o ser administrador");
}