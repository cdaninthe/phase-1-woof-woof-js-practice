document.addEventListener('DOMContentLoaded', () => {

    const dogBar = document.getElementById('dog-bar')
    const dogInfo = document.getElementById('dog-info')
    const filter = document.getElementById('good-dog-filter')

    fetchPups()

    //Filter dogs
    filter.addEventListener('click', () => {
        const span = document.querySelectorAll('span')
        span.forEach(element => {
            element.remove()
        });
        if (filter.innerText === 'Filter good dogs: OFF'){
            filter.innerText = 'Filter good dogs: ON'
        }
        else {filter.innerText = 'Filter good dogs: OFF'}
        
        fetchPups()
    })

    //Fetch pup data
    function fetchPups(){
        fetch('http://localhost:3000/pups')
        .then(resp => resp.json())
        .then(data => {            
            if (filter.innerText === 'Filter good dogs: ON'){
                goodPups(data)
            }
            else {addPups(data)}
        })
    }


    //Add all pups to the dog bar
    function addPups(arr){
        arr.forEach(pup => {
            const span = document.createElement('span')
            span.innerText = pup.name
            span.id = pup.id
            dogBar.appendChild(span)
            span.addEventListener('click', () => {
                pupInfo(pup)
            })
        });
    }

    //Display pup info
    function pupInfo(pup){
        dogInfo.innerText = ''
        const img = document.createElement('img')
        const h2 = document.createElement('h2')
        const btn = document.createElement('button')

        img.src = pup.image
        h2.innerText = pup.name

        btn.innerText = isGoodDog(pup)
        
        dogInfo.appendChild(img)
        dogInfo.appendChild(h2)
        dogInfo.appendChild(btn)

        btn.addEventListener('click', () => {
            if(pup.isGoodDog === true){
                pup.isGoodDog = false
                document.getElementById(`${pup.id}`).remove()
            }
            else if (pup.isGoodDog === false){
                pup.isGoodDog = true
            }
            btn.innerText = isGoodDog(pup)
            updateDatabase(pup)
        })
    }

    //Update Button text / toggle
    function isGoodDog(pup){
        let btnText
        if (pup.isGoodDog === true){
            btnText = 'Good Dog!'
        }
        else if (pup.isGoodDog === false){
            btnText = 'Bad Dog!'
        }
        return btnText
    }

    //Update pup database
    function updateDatabase(pup){
        fetch(`http://localhost:3000/pups/${pup.id}`, {
            method: 'PATCH',
            headers:{
                "Content-Type": "application/json",
                Accept: "application/json"
            },

            body: JSON.stringify(pup)
        })
        .then(resp => resp.json())
        .then(data => console.log(data))
    }


    //Add only good pups to the dog bar
    function goodPups(arr){
        let goodDogs = []
        arr.forEach(pup => {
            if (pup.isGoodDog === true){
                goodDogs.push(pup)
            }
        });
        addPups(goodDogs)
    }


})