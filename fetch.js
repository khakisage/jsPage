import fetch from "node-fetch";
import { resolve } from "path";

let url = "https://api.thedogapi.com/v1/breeds";
let imgUrl = "https://api.thedogapi.com/v1/images";

async function getImageFromImageId(referenceImageId) {
  try {
    // 강아지 종의 이미지 정보를 가져옵니다.
    const breedImageResponse = await fetch(`${imgUrl}/${referenceImageId}`);
    const breedImageData = await breedImageResponse.json();

    // 강아지 종의 정보와 이미지 URL을 반환합니다.
    return breedImageData.url;
  } catch (error) {
    // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
    console.error("오류 발생:", error);
    return null;
  }
}

fetch(url)
  .then((response) => response.json())
  .then(async (data) => {
    console.log(data);

    const name = data.map((el) => el.name);
    console.log(name);

    const nameId = data.map((el) => ({ name: el.name, id: el.id }));
    console.log(nameId);

    // let images = [];
    // for (const item of data) {
    //   const result = {
    //     id: item.id,
    //     name: item.name,
    //     image_url: await getImageFromImageId(item.reference_image_id),
    //   };
    //   // console.log(result);
    //   images.push(result);
    // }
    const promiseImage = data.map(
      (item) =>
        new Promise((resolve, reject) => {
          getImageFromImageId(item.reference_image_id).then((image_url) => {
            resolve({
              id: item.id,
              name: item.name,
              image_url: image_url,
            });
          });
        })
    );
    return Promise.all(promiseImage);
  })
  .catch((error) => console.error(error));
