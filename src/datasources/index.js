import { RESTDataSource } from 'apollo-datasource-rest';

export class MvrpAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.APP_URL;
  }

  async getAllCars() {
    return this.get('cars');
  }

  async getACar(plateNumber) {
    const result = await this.get('car', {
      plateNumber,
    });

    return result[0];
  }
}
