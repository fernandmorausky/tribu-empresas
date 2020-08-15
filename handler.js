'use strict';
const fetch = require('node-fetch');
const https = require('https')
const http = require('http')
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLA_PLANETA = process.env.TABLA_PLANETA;

const getDataAPI = async (listaURL, handl) => {
  let lista = []
  console.log("IterableData", listaURL)
  for (const url of listaURL) {
    const result = await fetch(url)
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

  let { idPlaneta } = JSON.parse(event.body);

  const handlPlaneta = resultJson => {
    let {
      residents: residentes,
      name: nombre,
      rotation_period: periodo_rotacion,
      diameter: diametro,
      population: poblacion,
      climate: clima,
      terrain: terrenos,
    } = resultJson;

    return {
      nombre: nombre.replace(' ', ''),
      periodo_rotacion,
      diametro,
      poblacion,
      clima,
      terrenos,
      residentes,
    }
  }
  const handlResidentes = resultJson => {
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
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          err
        })
      })
    })

  let resultResidentes = await getDataAPI(resultPlaneta.residentes, handlResidentes)
    .then(res => {
      return res;
    })
    .catch(err => {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          err
        })
      })
    })

  resultPlaneta.residentes = resultResidentes;
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
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          err
        })
      })
    });

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      data: resultPlaneta
    })
  })
}

module.exports.obtenerPlaneta = async (event, context, callback) => {
  let { nombre } = event.pathParameters;
  const params = {
    TableName: TABLA_PLANETA,
    Key: {
      nombre,
    }
  }
  let data;
  await dynamoDB.get(params)
    .promise()
    .then(res => {
      let { Item } = res;
      data = Item;
    })
    .catch((err) => {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          err
        })
      })
    });

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      data
    })
  })
}

module.exports.obtenerPlanetas = async (event, context, callback) => {

  let data;
  const params = {
    TableName: TABLA_PLANETA
  }
  await dynamoDB.scan(params)
    .promise()
    .then(res => {
      let { Items } = res;
      data = Items;
    })
    .catch((err) => {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          err
        })
      })
    });

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      data
    })
  })
}

module.exports.getDataAPI = getDataAPI;