document.addEventListener("DOMContentLoaded",()=>{
    let word;
    createSquares();
   
    getwordfromlist();
    
    const guessedWords =[[]];
   let availableSpace=1;
  
   let guessedWordCount=0;


    const keys= document.querySelectorAll(".keyboard-row button");
    //ensures clicking keyboard returns letter
    function getwordfromlist(){
        let wordlist=["hello", "great","union","adieu","carry","catch","beach","among","avoid","cable","baker","blind","board","being","carry","chart","clock","child","entry","error","forth","forty","frame"];
        let index=Math.floor(Math.random() * wordlist.length);

        word=wordlist[index];
      
        
        


    }
   function getNewWord(){

    fetch(
        `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5&`,
           
        {
            method: 'GET',
            
            headers: {
              'X-RapidAPI-Key': '24732f6fbbmsh8a6eaab83a66c2dp101fe6jsn551d52ad1ffa',
              'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
            },
    }
    )
.then((response)=>{
    return response.json();
})
.then((res)=>{
    word=res.word;
})

.catch((err)=>{
    console.error(err);
})


   }

    function getCurrentWordArr(){
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords-1];


    }

    function getTileColor(letter,index){
        const isCorrectLetter= word.includes(letter);
        if(!isCorrectLetter){
            const letterkey = "k"+letter;
            const keyboardletter =document.getElementById(letterkey);
            keyboardletter.style= `background-color:rgb(219, 220, 218)`;
           
            return "rgb(219, 220, 218)";
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition

        if(isCorrectPosition){
            const letterkey = "k"+letter;
            const keyboardletter =document.getElementById(letterkey);
            keyboardletter.style= `background-color:rgb(195, 222, 182)`;
           
            return "rgb(195, 222, 182)";
            
        }

        const letterkey = "k"+letter;
        const keyboardletter =document.getElementById(letterkey);
        keyboardletter.style= `background-color:rgb(251, 238, 149)`;

        return "rgb(251, 238, 149)";

    }

    

    function handleSubmitWord(){
        const currentWordArr =getCurrentWordArr();
        if(currentWordArr.length!==5){
            window.alert("Word must be 5 letters.")

        }

        const currentWord = currentWordArr.join('');

        fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
            method: "GET",
            headers: {
              "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
              "x-rapidapi-key": "24732f6fbbmsh8a6eaab83a66c2dp101fe6jsn551d52ad1ffa",
            },
          })
            .then((res) => {
              if (!res.ok) {
                throw Error();
              }
      

        const firstLetterId = guessedWordCount*5+1;

        const interval = 200;
        currentWordArr.forEach((letter,index) => {
            setTimeout(()=>{
                const tileColor = getTileColor(letter,index);
                const letterId = firstLetterId+index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style= `background-color:${tileColor};border-color:${tileColor}`;
            }, interval*index);

        });
        guessedWordCount+=1;
        if(currentWord === word){
            window.alert("Congratulations!");
            return;
        }

        if(guessedWords.length== 6){
            window.alert(`You have run out of tries.The correct word is ${word}.`);
            return;
        }

        guessedWords.push([]);

    })
    .catch(()=>{
        window.alert("Word does not exist");
        return;
    });


    }

    function updateGuessedWords(letter){
        const currentWordArr=getCurrentWordArr();

        if (currentWordArr && currentWordArr.length<5){
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpaceEl.classList.add("animate__pulse");
            availableSpace=availableSpace+1;
            availableSpaceEl.textContent= letter;

        }
        return;


    }
    //renders squares on board
    function createSquares(){

      
        const gameBoard = document.getElementById("board")

        for(let index=0; index<30;index++){
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id",index+1);
            gameBoard.appendChild(square);
        }

    }

    function deleteLetter(){
        if((availableSpace-1)<=guessedWordCount*5){
            
            return;
        }

        const currentWordArr=getCurrentWordArr();
        const removedLetter = currentWordArr.pop();

        guessedWords[guessedWords.length-1]=currentWordArr;
        const lastLetterEl =document.getElementById(String(availableSpace-1));

        lastLetterEl.textContent="";
        availableSpace= availableSpace-1;
        
    }
    document.addEventListener('keypress', function(event) {

         if(event.key=="Enter"){
                handleSubmitWord();
                return;


            }
            if(event.key=="Backspace"){
                deleteLetter();
                return;


            }else{
                updateGuessedWords(event.key);

            }
    });

    for(let i=0;i<keys.length;i++){
        keys[i].onclick = ({target}) => {
            const letter = target.getAttribute("data-key")
            if(letter=="enter"){
                handleSubmitWord();
                return;


            }
            if(letter=="del"){
                deleteLetter();
                return;


            }else{
                updateGuessedWords(letter);

            }
            console.log(letter);
            
        }



    }



    
})