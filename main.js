const apiKey = 'api_key=live_QLZLcnVWIyDq6az1WciiNjAGlm6QeYfJWXMH01VbC4EatMaoNMrp8Cxt5znYlm8E';
const url = 'https://api.thedogapi.com/v1/images/search?';

/* fetch dogs with breed names, get array of ids*/
const breedIds = fetch('https://api.thedogapi.com/v1/breeds')
  .then(res => res.json())
  .then(breedArr => breedArr.map(breed => breed.id));

const breedGroups = [
  'Sporting',
  'Working',
  'Herding',
  'Terrier',
  'Toy',
  'Non-Sporting',
  'Hound',
  'Other'
];

const collection = document.getElementById('collection-container');
const favorites = document.getElementById('favorites-container');

const randomNum = (num) => Math.floor(Math.random() * num);

const loader = document.querySelector('#loading')

const displayLoading = () => {
  loader.classList.add("display")
}

const hideLoading = () => {
  loader.classList.remove("display")
}

/* generate random list of dog IDs of specified length  */
const breedIdArr = async (num, arr) => {
  displayLoading()
  const availableIds = await arr;
  const idArr = [];
  while (num > 0) {
    let id = availableIds[randomNum(availableIds.length)];
    if (idArr.includes(id)) {
      id = availableIds[randomNum(availableIds.length)];
    } else {
      idArr.push(id);
      num --
    }
  }
  return idArr;
}

/* fetch dog data for each breed ID */
const getDogData = async (breedIds) => {
  const dogData = await breedIds 
    .then(ids => ids.map(id => fetch(`${url}${apiKey}&breed_ids=${id}`)
    .then(res => res.json())))
  const dogs = await Promise.all(dogData);
  return dogs;
}

/* create HTML for cards*/
const setDogCards = async (dogData) => {
  const dogCards = await dogData
    .then(dogData => {
      dogData.forEach(dog => {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('id', dog[0].breeds[0].id);
        breedGroups.includes(dog[0].breeds[0].breed_group) 
          ? card.setAttribute('data-breed', dog[0].breeds[0].breed_group) 
          : card.setAttribute('data-breed', 'Other');
        document.getElementById('collection-container').appendChild(card);
        
        const imgWrap = document.createElement('div');
        imgWrap.setAttribute('class', 'img-wrap');
        imgWrap.setAttribute('alt', 'dog image');
        card.appendChild(imgWrap);
        
        const img = document.createElement('img');
        img.setAttribute('src', dog[0].url);
        img.setAttribute('class', 'card-img');
        imgWrap.appendChild(img);
        
        const dogInfo = document.createElement('div');
        dogInfo.setAttribute('class', 'dog-info');
        card.appendChild(dogInfo);
        
        const breed = document.createElement('div');
        breed.setAttribute('class', 'breed');
        breed.innerHTML = `Breed: ${dog[0].breeds[0].name}`;
        dogInfo.appendChild(breed);
        
        const breedGroup = document.createElement('div');
        breedGroup.innerHTML = `Breed Group: ${dog[0].breeds[0].breed_group}`;
        dogInfo.appendChild(breedGroup);
      });
    });
  const cards = await dogCards
  hideLoading();
  return cards;
}

/* display breed count in favs list */
const breedCounter =  async (cardData) => {
  await cardData
  .then(() => {
    const allCards = Array.from(document.getElementById('favorites-container').getElementsByClassName('card'));
  for (const breed of breedGroups) {
    const breedCount = allCards.filter(dog => dog.dataset.breed === breed).length;
    const list = document.getElementById(breed);
    list.innerHTML = `${breed}: ${breedCount}`;
  }
  }); 
}

const updateCollections = (itemId, direction) => {
  const elm = document.getElementById(itemId)
  const container = direction === 'toFavs' ? favorites : collection;
  container.appendChild(elm);
}

/* set toggle between collections/favorites lists */
const setToggle = async (cardData) => {
  await cardData
    .then(() => {
      const allCards = document.getElementsByClassName('card');
      for (const card of allCards) {
        if (card) {
          card.addEventListener('click', function(e) {
            const itemId = e.currentTarget.id;
            const parentId = e.currentTarget.parentElement.id;
            let direction = "";
            parentId === 'collection-container' ? direction = 'toFavs' : direction = 'toMain';
            updateCollections(itemId, direction);
            breedCounter(cardData);
          });
        }
      }
    });
}

const sortData = (direction, container, cardArr) => {
  const cardContainer = document.getElementById(container);
  cardArr.sort((a, b) => {
    if (a.textContent < b.textContent) return direction === 'desc' ? 1 : -1;
    else if (a.textContent > b.textContent) return direction === 'desc' ? -1 : 1;
    else return 0;
    }); 
  cardArr.forEach(card => cardContainer.appendChild(card));
}

const setSortBtn = async (cardData) => {
  await cardData
    .then(() => {
      const sortBtn = document.getElementsByClassName('sort-btn'); 
      for (const btn of sortBtn) {
        btn.addEventListener('click', function() {
          const allCards = document.getElementById(this.dataset.container).getElementsByClassName('card');
          const arr = Array.from(allCards);
          sortData(this.dataset.sortdir, this.dataset.container, arr)
        });
      }
    })
}

const dogIds = breedIdArr(30, breedIds);
const dogData = getDogData(dogIds);
const dogCards = setDogCards(dogData);

setToggle(dogCards);
setSortBtn(dogCards);
breedCounter(dogCards);


 
  



















