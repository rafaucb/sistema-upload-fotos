import SparkMD5 from "spark-md5";

/**
 * Calcula o hash MD5 de um arquivo (foto) local no navegador.
 * @param {File} file - O arquivo a ser processado.
 * @returns {Promise<string>} - O hash MD5 da foto.
 */
export function calcularHashDoArquivo(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const binaryStr = e.target.result;
      const hash = SparkMD5.ArrayBuffer.hash(binaryStr);
      resolve(hash);
    };
    reader.onerror = function (err) {
      reject(err);
    };
    reader.readAsArrayBuffer(file);
  });
}
