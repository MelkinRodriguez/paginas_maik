let edad =19

let tipodeusuario="invitado"
if (edad>=18){
    console.log("eres mayor de edad ") 

switch(tipodeusuario){
    case "admin":
        console.log("tienes acceso total al sistema")
    break
    case "usuario":
        console.log("tienes acceso limitado")

    break
    case "invitado": 
        console.log("solo puedes ver el contenido publico")
    break
    default:
        console.log("tipo de usuario no definido")
    }
}else{
    console.log("eres menor de edda, acceso_denegado")
}