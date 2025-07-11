/*let llueve=false;
if(!llueve){
console.log("puedo salir sin paraguas");
}

let resultado=true||false&&false;
console.log(resultado)//true
let resultado=(true||false)&& false;
console.log (resultado);//false*/
let edad=17;
let esPremiun=true;
let tieneDeuda=false;
if((edad>=18||esPremiun)&&!tieneDeuda){
    console.log("acceso a la promocion concedido");
}else{
    console.log("no puedes acceser a la promocion");
}