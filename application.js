// Configuration et paramétrage de la connexion à la base de données
const mongoose = require('mongoose');
const {ObjectId}=require('mongoose').Types;
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('\x1b[1m\x1b[33m%s\x1b[0m','--------------Installing and setting up Mongoose------------------\n\n')
  console.log('L\'application est connectée à la base de données MongoDB');
}).catch(err => {
  console.error('Erreur de connexion à la base de données MongoDB :', err);
});

// Création du schéma Mongoose pour Person
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, default: 0 },
  favoriteFoods: { type: [String], default: [] }
});
const Person = mongoose.model('Person', personSchema);
console.log('\x1b[1m\x1b[33m%s\x1b[0m','------------Create a person with this prototype------------\n\n');
console.log(Person);
// step 3 : Fonction pour insérer une personne dans la collection "Person"
const createPerson = async () => {
  try {
    const person = new Person({name: 'wassim',age: 30,favoriteFoods: ['music', 'development','pizza']});
    const savePerson = await person.save();
    console.log('\x1b[1m\x1b[33m%s\x1b[0m','------------Create and Save a Record of a Model------------\n\n');
    console.log(`La personne ${savePerson.name} a été créée dans la base de données`);
    return savePerson;
  } catch (err) {
    console.error('Erreur lors de la création de la personne :', err);
  }
}

//step 4 : fonction pour insérer pluiseurs personne dans collection "Person"
const arrayofPerson = [{name : 'wafa', age: 29, favoriteFoods:["pizza","sandiwich"]},
{name : 'mahran', age: 9, favoriteFoods:["pizza","speggeti"]},
{name : 'nader', age: 15, favoriteFoods:["pizza","mlwai"]},
{name : 'samira', age: 22, favoriteFoods:["pizza","cuisse panné"]},
{name : 'wissem', age: 33, favoriteFoods:["makloub","escalope grillé"]}];
const createManyPerson = async()=>{
  try{
const data = await Person.create(arrayofPerson);
console.log('\x1b[1m\x1b[33m%s\x1b[0m','------------Create Many Records with model.create()------------\n\n')
console.log('voici les personne crée dans la base de donnée avec succées',data.map(tabPerson=> tabPerson.name),'avec IDs',data.map(tabPerson=> tabPerson._id))
return data; 
}catch{
    console.error(err);
  }
}

//step 5 : fonction qui permet de recherche par nom de person
const FindOnePerson = async(personeName)=>{
  try{
    const data = await Person.find({name : personeName});
    //methode pour compter le nombre de name au lieu de repétion d'affichage par nom
    const count = await Person.countDocuments({name:personeName});
    console.log('\x1b[1m\x1b[33m%s\x1b[0m','------------Use model.find() to Search Your Database------------\n\n');
    console.log('les personnes trouves de nom ',personeName,count,'avec les IDs:',data.map(person => person._id));
  return data,count;
  }catch{
    console.error(err);
  }
}

//step 6 : fonction qui permet de recherche avec methode findone une favroite food
const FindOneFood = async(food)=>{
  try{
    const data = await Person.findOne({favoriteFoods: food});
    const personnes = await Person.find({favoriteFoods:food});
    const count = await Person.countDocuments({favoriteFoods:food})
    console.log('\x1b[1m\x1b[33m%s\x1b[0m','------------Use model.findOne() to Return a Single Matching Document from Your Database------------\n\n');
    console.log('la prémiére personne dans la base avec food',food,'sont :',data.name,'parmi  qui aime le même food',count,'des personnes');
    return data,count,personnes;
  }catch{
    console.error(err);
  }
}

//step 7 : fonction qui permet de recherche avec _id de personne
const FindOndeId = async(personId)=>{
try{
  const data = await Person.findById(new ObjectId(personId));
  console.log('\x1b[1m\x1b[33m%s\x1b[0m','------------Use model.findById() to Search Your Database By _id------------\n\n');
  console.log('le perosne :',data.name,'de ID:',personId);
return data;
}catch{
console.error(err);
}
}

//step 8 : fonction qui permet de trouver une personne avec id and ajouter un favorite food et enregistrer au base de donnée
const FindoneIdUpdateSave = async (personId) => {
  try {
    const data = await Person.findById(new ObjectId(personId));
    const ancien = data.favoriteFoods;
    console.log('\x1b[1m\x1b[33m%s\x1b[0m','------------Perform Classic Updates by Running Find, Edit, then Save------------\n\n');
    console.log(`Anciens favoris de l'ID ${personId} :`, ancien);
    data.favoriteFoods.push('hamburger');
    const updatedPerson = await data.save();
    console.log(`Mis à jour avec succès et maintenant :`, updatedPerson.favoriteFoods);

    return updatedPerson;
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la personne :', err);
  }
};

//step 9: fonction qui permet de trouver,mis à jour un document
const updatePersonAge = async (personName) => {
  try {
    const data2 = await Person.findOne({name:personName});
    console.log('\x1b[1m\x1b[33m%s\x1b[0m','------------Perform New Updates on a Document Using model.findOneAndUpdate()------------\n\n')
    console.log('ancien : ',data2.name,'de age : ',data2.age);

    const updatedPerson = await Person.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true }
    );
    console.log(`Updated ${data2.name}'s age to 20:`, updatedPerson.age);
    return updatedPerson;
  } catch {
    console.error(err);
  }
};

//step 10 : fonction qui permet d'effacer un document avec clé de recherche _id
const deletePersonById = async (personId) => {
  try {
    const data = await Person.findByIdAndDelete(new ObjectId(personId));
    console.log('\x1b[1m\x1b[33m%s\x1b[0m','------------Delete One Document Using model.findByIdAndRemove------------\n\n')
    console.log('Deleted person:', data.name);
    return data;
  } catch{
    console.error(err);
  }
};

//step11 : fonction qui permet d'effacer plusieurs document avec clé de recherche nom de person
const deleteManyPerson = async (personName) => {
  try {
    const PersonFind = await Person.deleteMany({ name: personName });
    console.log('\x1b[1m\x1b[33m%s\x1b[0m','------------MongoDB and Mongoose - Delete Many Documents with model.remove()------------\n\n');
    console.log('Les personnes supprimées', PersonFind.deletedCount);
    return PersonFind;
  } catch{ 
    console.error(err); 
  }
};

//step12 : fonction qui permet de fait un filtre avec des parmatré spécifique
const findPizza = async (food) => {
  try {
    const data = await Person.find({ favoriteFoods: food }).limit(4).select({ name: 1, _id: 0 }).exec();
    
    console.log('\x1b[1m\x1b[33m%s\x1b[0m','------------Chain Search Query Helpers to Narrow Search Results------------\n\n')
    console.log(data);
  } catch{
    console.error(err);
  }
}

// fonction pour fermer la connexion à MongoDB
const closeConnection = () => {
  mongoose.connection.close()
    .then(() => {
      console.log('\x1b[1m\x1b[33m%s\x1b[0m','--------------fermteure connexion avec base de donnée------------------\n\n')
      console.log('Connexion MongoDB fermée');
    })
    .catch(err => {
      console.error('Erreur lors de la fermeture de la connexion MongoDB :', err);
    });
};

// fonction principale asynchrone pour exécuter le code
(async () => {
  try {
    const IdTest = '668ee98f5acc8a5a4925c3e4';
    const IdTest2 = '668ee98f5acc8a5a4925c3e5';
    const IdTest3 = '668ee98f5acc8a5a4925c3e7';
    const namee = 'mahran';
    const namee2 = 'wafa';
    const foodd = 'makloub';
    await createPerson();
    await createManyPerson();
    await FindOnePerson(namee2);
    await FindOneFood(foodd);
    await FindOndeId(IdTest); 
    await FindoneIdUpdateSave(IdTest2);
    await updatePersonAge(namee);
    await deletePersonById(IdTest3);
    await deleteManyPerson('wassim');
    await findPizza('pizza');

  } catch (error) {
    console.error('Erreur dans la fonction principale :', error);
  } finally {
    closeConnection();
  }
})();

