package main

import (
	"fmt"
	"log"
	"net/http"
	"encoding/json"
	"github.com/gorilla/mux"
)

type Account struct {
	FirstName string `json:"fname"`
	LastName string `json:"lname"`
	Email string `json:"email"`
	SaltedPassword string `json:"spassowrd"`
	CreatedTime int `json:"createdtime"`
	AccountID string `json:"account_id"`
}

type Keychain struct {
	Key string `json:"key"`
	AppName string `json:"appname"`
	AppKey string `json:"appkey"`
	KeyID string `json:"key_id"`
}

func createAccount() {

}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	response := "Welcome to the Portal API"
	w.Header().Set("content-type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", homeHandler)

	fmt.Println("Portal is ready when you are!")

	log.Fatal(http.ListenAndServe(":3000", r))
}