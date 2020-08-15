'use strict';
const fetch = require('node-fetch');
const https = require('https')
const http = require('http')
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLA_PLANETA = process.env.TABLA_PLANETA;


const getDataAPI = async (peliculas, handl) => {
  let lista = []
  console.log("IterableData", peliculas)
  for (const pelicula of peliculas) {
    const result = await fetch(pelicula)
      .then(response => {
        return response.json();
      })
      .then(resultJson => {
        console.log(resultJson)
        let data = handl(resultJson);
        return data;
      })
    lista.push(result)
  }
  return lista;
}

module.exports.insertarPlaneta = async (event, context, callback) => {


  let error;

  let { idPlaneta } = JSON.parse(event.body);

  const handlPlaneta = resultJson => {
    let {
      residents: residentes,
      films: peliculas,
      name: nombre,
      rotation_period: periodo_rotacion,
      diameter: diametro,
      population: poblacion,
      climate: clima,
      terrain: terrenos,
    } = resultJson;

    return {
      residentes,
      peliculas,
      nombre,
      periodo_rotacion,
      diametro,
      poblacion,
      clima,
      terrenos,
    }
  }
  const handlPeliculas = resultJson => {
    let {
      title: titulo,
      episode_id: id_episodio,
      opening_crawl: apertura,
      director,
      producer: productor,
      vehicles: vehiculos,
      characters: personajes
    } = resultJson;

    return {
      titulo,
      id_episodio,
      apertura,
      director,
      productor,
      vehiculos,
      personajes
    }
  }
  const handlVehiculo = resultJson => {
    let {
      name: nombre,
      model: modelo,
      manufacturer: fabricante,
      cost_in_credits: costo,
      passengers: pasajeros,
      vehicle_class: clase
    } = resultJson;

    return {
      nombre,
      modelo,
      fabricante,
      costo,
      pasajeros,
      clase
    }
  }
  const handlPersonaje = resultJson => {
    let {
      name: nombre,
      height: alto,
      mass: peso,
      hair_color: color_cabello,
      eye_color: color_ojos,
      gender: genero
    } = resultJson;

    return {
      nombre,
      alto,
      peso,
      color_cabello,
      color_ojos,
      genero
    }
  }

  let urlPlaneta = 'http://swapi.py4e.com/api/planets/' + idPlaneta;

  let resultPlaneta = await getDataAPI([urlPlaneta], handlPlaneta)
    .then(res => {
      return res[0];
    })
    .catch(err => {
      callback(Error(err))
    })

  let resultPeliculas = await getDataAPI(resultPlaneta.peliculas, handlPeliculas)
    .then(res => {
      return res;
    })
    .catch(err => {
      callback(Error(err))
    })

  for (let pelicula of resultPeliculas) {
    /////////////////////////////////////////////////
    //////////////  VEHICULOS  //////////////////////
    /////////////////////////////////////////////////
    let vehiculosInfo = await getDataAPI(pelicula.vehiculos, handlVehiculo)
      .then(res => {
        return res;
      })
    pelicula.vehiculosInfo = vehiculosInfo;
    /////////////////////////////////////////////////
    //////////////  PERSONAJES  /////////////////////
    /////////////////////////////////////////////////
    let personajesInfo = await getDataAPI(pelicula.personajes, handlPersonaje)
      .then(res => {
        return res;
      })
    pelicula.personajesInfo = personajesInfo;
  }
  resultPlaneta.peliculasInfo = resultPeliculas;
  console.log("resultPlaneta", resultPlaneta)

  const params = {
    TableName: TABLA_PLANETA,
    Item: resultPlaneta
  }
  await dynamoDB.put(params)
    .promise()
    .then(res => {
    })
    .catch((err) => {
      error = err;
    });

    if(!error){
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ 
          ok: true,
          message: resultPlaneta 
        })
      })
    }
    else{
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          message: error 
        })
      })
    }
  
}
module.exports.obtenerPlaneta = async event => {

  let result;
  let { nombre } = event.pathParameters;
  const params = {
    TableName: TABLA_PLANETA,
    Key: {
      nombre,
    }
  }
  await dynamoDB.get(params)
    .promise()
    .then(res => {
      result = res;
    })
    .catch((err) => {
      result = err;
    });


  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        input: result,
      },
      null,
      2
    ),
  };
}

module.exports.obtenerPlanetas = async event => {

  let result;
  const params = {
    TableName: TABLA_PLANETA
  }
  await dynamoDB.scan(params)
    .promise()
    .then(data => {
      result = data.Items;
    })
    .catch((err) => {
      result = err;
    });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        input: result,
      },
      null,
      2
    ),
  };
}

module.exports.getDataAPI = getDataAPI;