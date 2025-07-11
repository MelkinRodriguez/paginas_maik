let dia = "jueves";

switch (dia) {
    case "lunes":
        console.lo("es inicio de semana");
        break;
    case "viernes":
        console.log("es casi fin de semana")
        break;
    case "sabado":
    case "domingo":
        console.log("es fin de semana");
        break;
    default:
        console.log("es un dia entre semana")
}

