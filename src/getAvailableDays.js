import axios from "axios";

const copperApiUrl =
  "https://api.parkwhiz.com/v4/venues/448854/events/?fields=%3Adefault%2Csite_url%2Cavailability%2Cvenue%3Atimezone&q=%20starting_after%3A2020-12-05T00%3A00%3A00-07%3A00&sort=start_time&zoom=pw%3Avenue";

const eldoraApiUrl =
  "https://api.parkwhiz.com/v4/venues/478490/events/?fields=%3Adefault%2Csite_url%2Cavailability%2Cvenue%3Atimezone&sort=start_time&zoom=pw%3Avenue";

const apis = {
  copper: copperApiUrl,
  eldora: eldoraApiUrl,
};

export async function getAvailableDays(api) {
  const url = apis[api] ?? copperApiUrl;
  try {
    const response = await axios.get(url);
    const days = response.data;
    return days
      .filter((day) => {
        return day.availability.available;
      })
      .map((day) => {
        return {name: day.name, id: day.id};
      });
  } catch (error) {
    console.error(error);
    return [];
  }
}
