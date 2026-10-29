// ============================================================
// Tic Tac Toe - React Native (Expo)
// File: src/app/index.tsx
// ============================================================

// Import React dan Hook useState untuk menyimpan data yang bisa berubah
import { useState } from "react";
// Import komponen dasar React Native
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// SafeAreaView memastikan tampilan tidak tertutup notch / status bar
import { SafeAreaView } from "react-native-safe-area-context";

// ------------------------------------------------------------
// TIPE DATA (TypeScript)
// ------------------------------------------------------------
// Satu kotak bisa berisi 'X', 'O', atau null (kosong)
type SquareValue = "X" | "O" | null;

export default function App() {
  // ----------------------------------------------------------
  // 1. STATE MANAGEMENT (Manajemen State)
  // ----------------------------------------------------------
  // board  : array berisi 9 elemen yang mewakili 9 kotak papan
  // xIsNext: true berarti giliran 'X', false berarti giliran 'O'
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  // ----------------------------------------------------------
  // 2. LOGIKA PERMAINAN (Game Logic)
  // ----------------------------------------------------------
  // Fungsi untuk mendeteksi apakah ada pemain yang membentuk 3 simbol sejajar
  const calculateWinner = (squares: SquareValue[]): SquareValue => {
    // Daftar semua kombinasi indeks kotak yang menang
    const lines: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Baris horizontal
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Kolom vertikal
      [0, 4, 8],
      [2, 4, 6], // Diagonal
    ];

    // Periksa setiap kombinasi satu per satu
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      // Menang jika kotak a terisi dan isinya sama dengan kotak b dan c
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a]; // Mengembalikan 'X' atau 'O' sebagai pemenang
      }
    }
    // Tidak ada pemenang
    return null;
  };

  // Hitung pemenang setiap kali tampilan dirender ulang
  const winner = calculateWinner(board);
  // Papan penuh jika tidak ada lagi kotak yang bernilai null
  const isBoardFull = board.every((square) => square !== null);

  // ----------------------------------------------------------
  // 3. EVENT HANDLER (Penanganan Aksi Pengguna)
  // ----------------------------------------------------------
  // Dijalankan saat sebuah kotak ditekan
  const handlePress = (index: number) => {
    // Early return: abaikan jika kotak sudah terisi atau game sudah ada pemenang
    if (board[index] || winner) return;

    // IMMUTABILITY: jangan ubah state langsung (board[index] = 'X').
    // Buat salinan baru dengan spread operator [...], lalu ubah salinannya.
    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";

    // Perbarui state agar tampilan dirender ulang
    setBoard(newBoard);
    // Ganti giliran ke pemain berikutnya
    setXIsNext(!xIsNext);
  };

  // Fungsi untuk mengembalikan permainan ke kondisi awal
  const resetGame = () => {
    setBoard(Array(9).fill(null)); // Kosongkan semua kotak
    setXIsNext(true); // 'X' selalu mulai duluan
  };

  // ----------------------------------------------------------
  // 4. KOMPONEN KOTAK (Reusable Render Function)
  // ----------------------------------------------------------
  // Fungsi ini menghindari penulisan JSX yang sama berulang untuk 9 kotak
  const renderSquare = (index: number) => {
    return (
      <TouchableOpacity
        style={styles.square}
        onPress={() => handlePress(index)} // Panggil handlePress dengan indeks kotak
        activeOpacity={0.7} // Efek redup saat ditekan
      >
        {/* Warna teks merah untuk 'X', biru untuk 'O' */}
        <Text
          style={[
            styles.squareText,
            board[index] === "X" ? styles.textX : styles.textO,
          ]}
        >
          {board[index]}
        </Text>
      </TouchableOpacity>
    );
  };

  // Menentukan teks status permainan sesuai kondisi saat ini
  let status: string;
  if (winner) {
    status = `Pemenang: ${winner}!`;
  } else if (isBoardFull) {
    status = "Permainan Seri (Draw)!";
  } else {
    status = `Giliran Pemain: ${xIsNext ? "X" : "O"}`;
  }

  // ----------------------------------------------------------
  // TAMPILAN (UI)
  // ----------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* Judul Aplikasi */}
      <Text style={styles.title}>Tic Tac Toe</Text>

      {/* Menampilkan status game secara dinamis */}
      <Text style={styles.status}>{status}</Text>

      {/* Papan Permainan (grid 3x3 dengan Flexbox) */}
      <View style={styles.board}>
        {/* Baris 1: kotak 0, 1, 2 */}
        <View style={styles.row}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </View>
        {/* Baris 2: kotak 3, 4, 5 */}
        <View style={styles.row}>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </View>
        {/* Baris 3: kotak 6, 7, 8 */}
        <View style={styles.row}>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </View>
      </View>

      {/* Tombol Reset Permainan */}
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Mulai Ulang</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ------------------------------------------------------------
// 5. STYLING (Gaya Tampilan)
// ------------------------------------------------------------
// Di React Native, gaya ditulis sebagai objek JavaScript dengan properti
// mirip CSS tetapi memakai camelCase (backgroundColor, flexDirection, dst).
const styles = StyleSheet.create({
  // Wadah utama: memenuhi layar dan menengahkan isi
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  // Judul aplikasi
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  // Teks status (giliran / pemenang / seri)
  status: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
    color: "#555",
  },
  // Bingkai luar papan
  board: {
    borderWidth: 4,
    borderColor: "#333",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  // Satu baris papan: kotak disusun mendatar
  row: {
    flexDirection: "row",
  },
  // Satu kotak papan
  square: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  // Ukuran teks X / O di dalam kotak
  squareText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  // Warna merah untuk pemain X
  textX: {
    color: "#e74c3c",
  },
  // Warna biru untuk pemain O
  textO: {
    color: "#3498db",
  },
  // Tombol "Mulai Ulang"
  resetButton: {
    marginTop: 30,
    backgroundColor: "#2ecc71",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  // Teks pada tombol "Mulai Ulang"
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
