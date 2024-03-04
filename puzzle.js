var red = 5;
var kolona = 5;

var trenutnoPolje;
var drugoPolje;

var potez = 0;
var i=1;
var flag=0;
var nizPolja = [];
var nizPolja2 = [];

var ime;
var br=localStorage.getItem("broj");
var input=[];
for(let i=0;i<10;i++){
    input[i]=JSON.parse(localStorage.getItem("k"+i))  //ovo komentarisi kad pokreces prvi put
}

//ovo nemoj da komentarises kad pokreces prvi put

// var input=["Luka, preostalo vreme: 02:10", 
// "Sinisa, preostalo vreme: 02:10",
// "Bogdan, preostalo vreme: 02:07",
// "Jovana, preostalo vreme: 02:02",
// "Nikola, preostalo vreme: 02:00",
// "Ana, preostalo vreme: 01:55",
// "Jelena, preostalo vreme: 01:41",
// "Mirko, preostalo vreme: 01:40",
// "Slavisa, preostalo vreme: 01:24",
// "Nebojsa, preostalo vreme: 01:00"];

window.onload = function() {
    
    do{
        ime=prompt("Unesite vase ime:");
    }while(ime==null || ime=="");

    for(let i=0;i<10;i++){
        // localStorage.setItem("k"+i,JSON.stringify(input[i])); //ovo nemoj da komentarises kad pokreces prvi put
        document.getElementById("igraci").innerHTML+=(parseInt(i+1))+'.' + ' ' + localStorage.getItem("k"+i) + '<br>';
    }

//Ako zelimo da pamtimo ime svakog igraca kada otpocne sklapanje puzle:
    // if(br === null){
    //     input[0]=prompt("Unesite vase ime:");
    //     br++;
    
    //     localStorage.setItem("broj", br);
    //     localStorage.setItem("ime"+br, input[0]);
    // }
    // else{
    //     input[br]=prompt("Unesite vase ime:");
    //     document.getElementById("igraci").innerHTML+=input[br-1]+'<br>';
    //     br++; 
    
    //     localStorage.setItem("broj", br);
    //     localStorage.setItem("ime" + br, input[br-1]);
    // }
    


}

function dragStart() {
    trenutnoPolje = this; //this pokazuje na sliku na koju smo kliknuli da bismo je prevukli
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {
}

function dragDrop() {
    drugoPolje = this; //this pokazuje na sliku koju dropujemo
}



function start(){
    if(flag==1)return;
    flag=1;
    //pravi 5x5 tablu za puzlu
    for (let r = 0; r < red; r++) {
        for (let c = 0; c < kolona; c++) {
            // pravi bele <img> tagove unutar 5x5 table kako ne bi ispisao alt unutar diva 
            var polje = document.createElement("img");

            polje.src = "./images/blank.jpg";
            polje.setAttribute("id",i);
            
            nizPolja.push(polje.id)
            i=i+1;

            //drag funkcionalnost
            polje.addEventListener("dragstart", dragStart); 
            polje.addEventListener("dragover", dragOver);   
            polje.addEventListener("dragenter", dragEnter); 
            polje.addEventListener("dragleave", dragLeave); 
            polje.addEventListener("drop", dragDrop);      
            polje.addEventListener("dragend", dragEnd);      

            document.getElementById("board").append(polje);
        }
    }

    
    let slika = document.getElementById("resenje");
    slika.src="images/puzla.jpg";
    
    //delici
    let delici = [];
    for (let i=1; i <= red*kolona; i++) {
        delici.push(i.toString()); //ubacuje brojeve od 1 do broja delica u niz (Ujedno i imena delica prve slike)
    }
    delici.reverse(); //kako delici ne bi bili prikazani po redu
    for (let i =0; i < delici.length; i++) {
        let j = Math.floor(Math.random() * delici.length); //random() koristim kako bi svaki put kad refreshujem stranicu bio drugaciji redosled delica a floor koristim kako bi ga zaokruzio na prvi manji ceo broj
    
        //razmeni isto kako delici ne bi bili prikazani po nekoj logici
        let tmp = delici[i];
        delici[i] = delici[j];
        delici[j] = tmp;
    }
    
    for (let i = 0; i < delici.length; i++) {
        let polje2 = document.createElement("img"); //slicice koje prevlacimo
                    
        polje2.src = "./images/" + "r" + delici[i] + ".jpg";
        polje2.setAttribute("id", delici[i]); //svaka slicica sada ima svoj id takav da odgovara krajnjoj slici
        
                //drag funkcionalnost
        polje2.addEventListener("dragstart", dragStart); //klikni na sliku da je prevuces
        polje2.addEventListener("dragover", dragOver);   //prevuci sliku
        polje2.addEventListener("dragenter", dragEnter); //prevlacenje slike na neku drugu
        polje2.addEventListener("dragleave", dragLeave); //prevlacenje slike od neke druge
        polje2.addEventListener("drop", dragDrop);       //pustanje slike nadrugu
        polje2.addEventListener("dragend", function dragEnd(){
            if (trenutnoPolje.src.includes("blank")) {
                return; //izlazi iz fje kad pokusamo da zamenimo belo polje sa nekim drugim kako ne bi doslo do povecanja broja poteza bez razloga
            }
            
            let trenutnaImg = trenutnoPolje.src;
            let drugaImg = drugoPolje.src;
            trenutnoPolje.src = drugaImg;
            drugoPolje.src = trenutnaImg;
        
            nizPolja2.push(trenutnoPolje.id);
        
            console.log(nizPolja2);
            potez += 1;
            document.getElementById("potezi").innerHTML = potez;

            polje2.removeEventListener("dragend", dragEnd);
        });      //nakon sto se dragDrop zavrsi
        document.getElementById("delici").append(polje2); //umetanje delica puzle u polja
    }
    
    
    timer(nizPolja,nizPolja2);

}


function dragEnd() { //dokaz da fja postoji jer bez ovoga ne ce raditi osluskivac dogadjaja
}

function timer(niz1,niz2){ // fja koja smanjuje sekunde na timeru
    var sec=59;
    var min=2;
    var timer1 = setInterval(function(){
        
        niz2.sort((a, b) => a - b);
        console.log(niz2.toString());
        if(sec>=0){
            document.getElementById('vreme').innerHTML='0'+min+':'+sec;
            sec--;
        }
        else if(sec<0){
            min--;
            sec=59;
        }

        if(niz2.length==25 && potez==25){
            if(niz1.toString()==niz2.toString()){
                var rezMin=min;
                var rezSec=sec;
                alert("Resili ste puzlu, alal vera!");
                document.getElementById("rezIgre").innerHTML=ime+", "+"preostalo vreme: "+rezMin+":"+parseInt(rezSec+1);

                // localStorage.setItem("k"+i,JSON.stringify(input[i]));
                // document.getElementById("igraci").innerHTML+=localStorage.getItem("k"+i)+'<br>';

                clearInterval(timer1);
                return;
            }
            else{
                alert("Niste resili puzlu, nije alal vera...");
                
                clearInterval(timer1);
                return;
            }
        }

        if (sec == -1 && min==0) {
            alert("Kraj igre, osvezite stranicu!");
            clearInterval(timer1);
        }
    }, 1000);
}






