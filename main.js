const apiKey = 'api_key=live_QLZLcnVWIyDq6az1WciiNjAGlm6QeYfJWXMH01VbC4EatMaoNMrp8Cxt5znYlm8E';
const url = 'https://api.thedogapi.com/v1/images/search?';

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

const randomNum = (num) => Math.floor(Math.random() * num);

const breedIdArr = async (num, arr) => {
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

const getDogData = async (breeds) => {
  const promises = await breeds 
    .then(ids => ids.map(id => fetch(`${url}${apiKey}&breed_ids=${id}`)
    .then(res => res.json())))
  const dogs = await Promise.all(promises);
  console.log(dogs);
  return dogs;
}

const collection = document.getElementById('collection-container');
const favorites = document.getElementById('favorites-container');

const updateCollections = (itemId, direction) => {
  const elm = document.getElementById(itemId)
  if (itemId) {
    if (direction === 'toFavs') {
      favorites.appendChild(elm);
    } else if (direction === 'toMain') {
      collection.appendChild(elm);
    }
  }
}

const breedCounter =  async (cardData) => {
  await cardData
  .then(data => {
    const allCards = Array.from(document.getElementById('favorites-container').getElementsByClassName('card'));
  for (const breed of breedGroups) {
    const breedCount = allCards.filter(dog => dog.dataset.breed === breed).length;
    const list = document.getElementById(breed);
    list.innerHTML = `${breed}: ${breedCount}`;
  }
  }); 
}

const setDogCards = async (dogs) => {
  const promises = await dogs
    .then(dogData => {
      const dogs = dogData;
      dogs.forEach(dog =>{
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('id', dog[0].breeds[0].id);
        card.setAttribute('data-breed', dog[0].breeds[0].breed_group);
        if (!breedGroups.includes(card.dataset.breed)) card.setAttribute('data-breed', 'Other');
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
  const dogsCards = await promises;
  return dogsCards;
}

const setToggle = async (cardData) => {
  await cardData
    .then(data => {
      const allCards = document.getElementsByClassName('card');
      const allImgs = document.getElementsByClassName('card-img');
      const allBreeds = document.getElementsByClassName('breed');
      const allGroups = document.getElementsByClassName('group');
      for (const card of allCards) {
        if (card) {
          card.addEventListener('click', function(e) {
            const itemId = e.target.id;
            const parentId = e.target.parentElement.id;
            let direction = "";
            parentId === 'collection-container' ? direction = 'toFavs' : direction = 'toMain';
            updateCollections(itemId, direction);
            breedCounter(cardData);
          });
        }
      }
      for (const img of allImgs) {
        if (img) {
          img.addEventListener('click', function(e) {
            const itemId = e.target.parentElement.parentElement.id;
            const parentId = e.target.parentElement.parentElement.parentElement.id;
            let direction = "";
            parentId === 'collection-container' ? direction = 'toFavs' : direction = 'toMain';
            updateCollections(itemId, direction);
          });
        }
      }
      for (const breed of allBreeds) {
        if (breed) {
          breed.addEventListener('click', function(e) {
            const itemId = e.target.parentElement.parentElement.id;
            const parentId = e.target.parentElement.parentElement.parentElement.id;
            let direction = "";
            parentId === 'collection-container' ? direction = 'toFavs' : direction = 'toMain';
            updateCollections(itemId, direction);
          });
        }
      }
      for (const group of allGroups) {
        if (group) {
          group.addEventListener('click', function(e) {
            const itemId = e.target.parentElement.parentElement.id;
            const parentId = e.target.parentElement.parentElement.parentElement.id;
            let direction = "";
            parentId === 'collection-container' ? direction = 'toFavs' : direction = 'toMain';
            updateCollections(itemId, direction);
          });
        }
      }
    });
}

const sortData = (direction, container, arr) => {
  const cardContainer = document.getElementById(container);
  if (direction === 'desc') {
    arr.sort((a, b) => {
      if (a.textContent < b.textContent) return 1;
      else if (a.textContent > b.textContent) return -1;
      else return 0;
  }); 
} else if (direction === 'asc') {
  arr.sort((a, b) => {
    if (b.textContent < a.textContent) return 1;
    else if (b.textContent > a.textContent) return -1;
    else return 0;
  });
}
arr.forEach(card => cardContainer.appendChild(card));
}

const setSortBtn = async (cardData) => {
  await cardData
    .then(data => {
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
















