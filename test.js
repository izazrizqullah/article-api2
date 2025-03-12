const user = ["ALI", "JAMES", "BRYAN"];
const age = [23, 25, 27];
const address = ["Purwokerto", "Cilacap", "Banyumas"];

// soal 1
// ```
// const data = [
//       user 1: {
//               name: ALI,
//               age: 23,
//               address: Purwokerto
//               },
//       user 2: {
//               name: JAMES,
//               age: 25,
//               address: Cilacap
//               },
//       user 3: {
//               name: BRYAN,
//               age: 27,
//               address: Banyumas
//               },
// ]
// ```;

function data() {
  for (let i = 0; i < user.length; i++) {
    console.log(`user ${i + 1}: {
              name: ${user[i]},
              age: ${age[i]},
              address: ${address[i]}
              }`);
  }
}

data();

// soal 2
// urutkan data user dari belakang ["BRYAN", "JAMES", "ALI",]
// urutkan data age dari belakang [27, 25, 23]

const filterAge = age.sort((a, b) => b - a);

console.log(filterUser);

// soal 3
// tambahkan data user = ["ANNA"]
// tambahkan data age = [21]
// tambahkan address = ["Banjarnegara"]

// soal 4
// ada angka 1 - 100
// jika angka tersebut dibagi 3 = 0 maka console.log ("Ping")
// jika angka tersebut dibagi 5 = 0 maka console.log
