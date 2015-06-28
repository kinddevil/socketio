package main

import (
	// "fmt"
	"log"
	"net/http"
	"net/http/httputil"
)

func redirect(w http.ResponseWriter, r *http.Request) {
	// log.Println(r.Referer())
	// log.Println("Some log...")
	// log.Println(r.URL.Query())
	// http.Redirect(w, r, "http://localhost:5000", 307)

	director := func(req *http.Request) {
		req = r
		req.URL.Scheme = "http"
		req.URL.Host = "localhost:5000"
	}
	proxy := &httputil.ReverseProxy{Director: director}
	log.Println(r.Host)
	log.Println(r.Header)
	log.Println(r.URL.Scheme)
	log.Println(r.URL.Host)
	log.Println(r.URL.Path)
	log.Println(r.URL.RequestURI())
	log.Println(r.URL.String())
	log.Println("Some log...")

	proxy.ServeHTTP(w, r)
}

func main() {
	http.HandleFunc("/", redirect)
	err := http.ListenAndServe(":9091", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
