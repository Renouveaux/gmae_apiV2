
	/**
	*
	* Permet de faire une recherche dans un tableau d'objet et ressort le ou les objets matchant
	*
	*/
	Array.prototype.filterByString = function(search){

		return this.filter(function(el){

			for(var k in el){

				if(typeof(el[k]) == "string" && el[k].indexOf(search) != -1){
					return true;
				}
			}

			return false;
		});

	};