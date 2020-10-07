/**
 *  FONCTION POUR FORMATER UN TABLEAU DE POINTS
 * ex : const points = [ {x:..,y:..}, {x:..,y:..}, {x:..,y:..}, ... ]
 *
 * const 256Points = simplifiyArray(points,256);
 *
 * si cette fonction est intégrée dans une classe, supprimer le mot "function"
 */

function simplifyARRAY(array, number) {
  /**
   * array : le tableau de point de longueur variable
   * number : la valeur que vous voulez obtenir dans votre tableau
   */
  /**
   * on calcul un facteur de réduction /augmentation
   * (ce qui va supprimer des point, ou en dupliquer d'autres)
   */
  const fact = array.length / (number - 1);
  // on initialise un objet vide
  const filteredPoints = {};
  /**
   * Petit hack pour palier aux variation de nombre suivant le facteur
   * on prépare un compteur pour vérifier si on a le bon nombre à la fin
   */
  let counter = 0;
  //on fait une boucle qui s'incrémente du facteur pré-défini
  for (let i = 0; i < array.length; i += fact) {
    const index = Math.floor(i);
    filteredPoints[i] = array[index];
    counter++;
  }
  // finalisation du petit hack
  if (counter == number - 1) {
    filteredPoints["last"] = array[array.length - 1];
  }
  // on retourne un object qui aura le nombre choisi de KEYS
  /**
   * Attention !
   * on a transformé un tableau en OBJET
   * un objet ne peut pas se parser par une boucle for.
   * on doit d'abord récupérer un tableau de keys avec la méthode
   * --> const KEYS = Object.keys(monObjet)
   * ensuite KEYS peut être parser avec une boucle for.
   * cela nous donnera l'ensemble des keys pour l'objet.
   *
   * EXEMPLE:
   * const monObjet = {"a":1, "m":2, "t":8}
   * const KEYS = Object.keys(monObjet) --> ["a","m","t"]
   * for(const key of KEYS){
   *    console.log(monObjet[key]) --> 1,2,8
   * }
   */
  return filteredPoints;
}
