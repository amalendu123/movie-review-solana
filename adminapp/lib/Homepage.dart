import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  TextEditingController _movietitle = TextEditingController();
  TextEditingController _description = TextEditingController();
  TextEditingController _imdb = TextEditingController();
  File? _image;
  String? _imageUrl;

  Future<void> getImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    setState(() {
      if (pickedFile != null) {
        _image = File(pickedFile.path);
      } else {
        print('No image selected.');
      }
    });
  }

  Future<void> uploadImage() async {
    if (_image == null) return;

    try {
      final storageReference = FirebaseStorage.instance
          .ref()
          .child('File/${DateTime.now().toIso8601String()}');
      final uploadTask = storageReference.putFile(_image!);

      await uploadTask.whenComplete(() => null);
      final downloadUrl = await storageReference.getDownloadURL();

      setState(() {
        _imageUrl = downloadUrl;
      });

      print("The download URL is $_imageUrl");
    } catch (e) {
      print('Error uploading image: $e');
    }
  }

  void submitForm() async {
    if (_imageUrl == null) {
      print('Please upload an image first');
      return;
    }

    String movie_title = _movietitle.text;
    String description = _description.text;
    String imdb = _imdb.text;

    try {
      var client = http.Client();
      var url = Uri.parse('http://localhost:8080/add_movies');
      var response = await client.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          "Movie_title": movie_title,
          "Description": description,
          "imdb": imdb,
          "img_link": _imageUrl
        }),
      );

      if (response.statusCode == 200) {
        print('Movie added successfully');
      } else {
        print('Failed to add movie: ${response.body}');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: GNav(onTabChange: (index) {}, tabs: [
        GButton(
          icon: CupertinoIcons.home,
          text: 'Home',
        ),
        GButton(
          icon: CupertinoIcons.film,
          text: 'Films',
        ),
      ]),
      body: SingleChildScrollView(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  "Welcome to movie review",
                  style: TextStyle(fontSize: 24, color: Colors.black),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: _movietitle,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Enter the Movie title',
                  ),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: _description,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Enter the description of the movie',
                  ),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: _imdb,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Enter the IMDb rating',
                  ),
                ),
                const SizedBox(height: 20),
                _image == null
                    ? Text('No image selected.')
                    : Image.file(_image!),
                ElevatedButton(
                  onPressed: getImage,
                  child: const Text("Select Image"),
                ),
                ElevatedButton(
                  onPressed: uploadImage,
                  child: const Text("Upload Image"),
                ),
                const SizedBox(height: 20),
                Center(
                  child: ElevatedButton(
                    onPressed: submitForm,
                    child: const Text("Submit"),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
