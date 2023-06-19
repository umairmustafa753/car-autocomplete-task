import { readCSV } from "../../helper/readCSV";

export default async function handler(req, res) {
  const { carName } = req.query;

  try {
    const cars = await readCSV("./docs/cars.csv");

    const matchingCars = cars.filter((car) =>
      car.CarName.toLowerCase().includes(carName.toLowerCase())
    );

    res.status(200).json(matchingCars);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving car data." });
  }
}
