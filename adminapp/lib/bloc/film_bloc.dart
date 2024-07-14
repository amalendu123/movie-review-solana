import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';

part 'film_event.dart';
part 'film_state.dart';

class FilmBloc extends Bloc<FilmEvent, FilmState> {
  FilmBloc() : super(FilmInitial()) {
    on<FilmEvent>((event, emit) {
      // TODO: implement event handler
    });
  }
}
