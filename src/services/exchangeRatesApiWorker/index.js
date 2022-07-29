import axios from 'axios'

const url = 'https://api.apilayer.com'
const apiKey = 'skNS8PAEuqN6t8OdsDgrBO2Jnik9bieN'

const createRequestArdress = ({from, to, amount}) => {
  return `${url}/fixer/convert?to=${to}&from=${from}&amount=${amount}`
}

export const getExchangeRate = async ({from, to, amount}) => {
  const requestAdress = createRequestArdress({
    from: from,
    to: to,
    amount: amount
  })
  return await axios.get(requestAdress, {
    headers: {
      'apiKey': apiKey
    } 
  })
}

